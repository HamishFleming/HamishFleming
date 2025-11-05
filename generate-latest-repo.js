import axios from "axios";
import fs from "fs";

const readmePath = "./README.md";
const token = process.env.MY_GITHUB_TOKEN;

async function main() {
    if (!token) throw new Error("MY_GITHUB_TOKEN not set");

    // Fetch all repos for the authenticated user
    const res = await axios.get("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${token}` },
        params: { per_page: 100 }, // fetch up to 100 repos
    });

    // Filter out archived repos.
    const activeRepos = res.data.filter((repo) => !repo.archived);

    if (activeRepos.length === 0) {
        throw new Error("No active repositories found");
    }

    // Sort by last push
    activeRepos.sort(
        (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    );

    const latestRepo = activeRepos[0].name;
    console.log("Latest repo:", latestRepo);

    // Read README and replace badge repo
    let readme = fs.readFileSync(readmePath, "utf-8");

    readme = readme.replace(
        /(repo=)[^&]+/,
        `$1${latestRepo}`
    );

    fs.writeFileSync(readmePath, readme);
    console.log("README.md updated successfully!");
}

main().catch(console.error);
