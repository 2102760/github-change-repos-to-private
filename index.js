const axios = require("axios");

require('dotenv').config();

const axiosOptions = {
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
};

(async () => {
    const reposResponse = await axios.get(
        "https://api.github.com/user/repos?visibility=public&affiliation=owner&per_page=100",
        axiosOptions,
    )

    if (reposResponse.status !== 200) {
        console.log("\x1b[31mNop Error while getting users", reposResponse);
    }

    const repos = reposResponse.data;

    const reposCount = repos.length;

    for (const repo of repos) {
        const i = repos.indexOf(repo);
        const repoUpdateResponse = await axios.patch(
            `https://api.github.com/repos/${repo.full_name}`,
            {
                private: true
            },
            axiosOptions
        );

        if (repoUpdateResponse.status === 200) {
            console.log(`\x1b[32mRepo ${i + 1} of ${reposCount} changed to private.`);
        } else {
            console.log("\x1b[31mNopError while updating repo ${i + 1} of ${reposCount}", {
                response: res,
                repo: repo,
            });
        }
    }
})();