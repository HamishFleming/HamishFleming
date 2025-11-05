import axios from "axios";
import fs from "fs";

const username = "HamishFleming";
const readmePath = "./README.md";

async function main() {
    // Fetch latest updated repo
    const res = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: { sort: "updated", per_page: 1 },
    });

    const latestRepo = res.data[0].name;

    // Read README
    let readme = fs.readFileSync(readmePath, "utf-8");

    // Replace the current repo in badge URL
    readme = readme.replace(
        /(repo=)[^&]+/,
        `$1${latestRepo}`
    );

    fs.writeFileSync(readmePath, readme);
    console.log(`Updated latest repo to: ${latestRepo}`);
}

main();
