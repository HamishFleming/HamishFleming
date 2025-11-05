import axios from "axios";
import fs from "fs";

const username = "HamishFleming";
const readmePath = "./README.md";
const token = process.env.MY_GITHUB_TOKEN; // Must be set in your environment

async function main() {
    if (!token) throw new Error("GITHUB_TOKEN not set");

    // Fetch all repos (including private) accessible to the user
    const res = await axios.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `token ${token}`,
        },
        params: {
            sort: "updated",
            direction: "desc",
            per_page: 1,
        },
    });

    const latestRepo = res.data[0].name;
    console.log(`Latest repo fetched: ${latestRepo}`);

    // Read README
    let readme = fs.readFileSync(readmePath, "utf-8");

    // Replace the current repo in badge URL
    readme = readme.replace(/(repo=)[^&]+/, `$1${latestRepo}`);

    fs.writeFileSync(readmePath, readme);
    console.log(`Updated latest repo to: ${latestRepo}`);
}

main();
