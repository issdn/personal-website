export const onPostBuild = async ({ utils }) => {
    try {
        await utils.run.command("npx playwright install")
        var { stderr, stdout } =  await utils.run.command("npm run test:all")
        console.log(stdout)
    } catch {
        utils.build.failBuild(stderr)
    }
}