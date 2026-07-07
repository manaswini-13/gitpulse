import { NextResponse } from 'next/server';

function computeHealthScore(repoData, commits) {
  let score = 100;
  const deductions = [];
  const openIssues = repoData.open_issues_count;
  const stars = repoData.stargazers_count;
  
  if (stars >= 10) {
    const ratio = openIssues / stars;
    if (ratio >= 1.0) { score -= 40; deductions.push('Poor Issue Hygiene: Open issues outnumber stars (-40 pts)'); }
    else if (ratio >= 0.5) { score -= 25; deductions.push('Moderate Issue Backlog (-25 pts)'); }
    else if (ratio >= 0.25) { score -= 12; deductions.push('Minor Issue Accumulation (-12 pts)'); }
    else if (ratio >= 0.1) { score -= 5; deductions.push('Slight Issue Backlog (-5 pts)'); }
  }

  if (commits && commits.length > 0) {
    const lastCommitDate = new Date(commits[0].commit.committer.date);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - lastCommitDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 180) { score -= 40; deductions.push(`Inactive: Last commit > 180 days ago (-40 pts)`); }
    else if (diffDays > 90) { score -= 30; deductions.push(`Stale: Last commit > 90 days ago (-30 pts)`); }
    else if (diffDays > 30) { score -= 15; deductions.push(`Delayed: Last commit > 30 days ago (-15 pts)`); }
    else if (diffDays > 14) { score -= 5; deductions.push(`Minor Inactivity (-5 pts)`); }
  } else {
    score -= 40;
    deductions.push('No recent commit history uncovered (-40 pts)');
  }

  score = Math.max(0, Math.min(100, score));
  let grade = 'CRITICAL';
  if (score >= 95) grade = 'A+';
  else if (score >= 90) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 50) grade = 'D';

  return { score, grade, deductions };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) return NextResponse.json({ error: 'Missing owner or repo' }, { status: 400 });

  try {
    const [repoResponse, commitsResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`)
    ]);

    if (repoResponse.status === 404) return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    const repoData = await repoResponse.json();
    const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];
    const healthReport = computeHealthScore(repoData, commitsData);

    return NextResponse.json({
      ok: true,
      repo: { name: repoData.full_name, description: repoData.description },
      metrics: { stars: repoData.stargazers_count, openIssues: repoData.open_issues_count, contributors: repoData.network_count || 0 },
      score: healthReport
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
