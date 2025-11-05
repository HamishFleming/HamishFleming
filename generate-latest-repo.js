import axios from "axios";
import fs from "fs";

const username = "HamishFleming";
const readmePath = "./README.md";
const token = process.env.MY_GITHUB_TOKEN;

async function main() {
    const res = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: { sort: "updated", per_page: 1 },
        headers: {
            Authorization: `token ${token}`,
        },
    });

    console.log("Fetched latest repository data from GitHub.");
    console.log(res.data);
    const latestRepo = res.data[0].name;
    console.log(`Latest repo fetched: ${latestRepo}`);

    let readme = fs.readFileSync(readmePath, "utf-8");

    readme = readme.replace(/(repo=)[^&]+/, `$1${latestRepo}`);

    fs.writeFileSync(readmePath, readme);
    console.log(`Updated latest repo to: ${latestRepo}`);
}

main();
