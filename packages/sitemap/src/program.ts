import {Command} from "commander";

export const getCommand = () => {
    return new Command()
        .description(
            `Generates the sitemap.`
        )
        .requiredOption('-b, --base-uri <base-uri>', 'Base URI')
        .requiredOption('-o, --output-dir <output-dir>', 'Output directory');
};
