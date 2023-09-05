import {APIConfiguration} from "@apidocs/common";

type Document = {
    solr_command: string;
    content_type: string;
    id: string;
    uri: string;
    name: string;
    description: string;
}

type CanonicalFormat = {
    data_source: string;
    documents: Array<Document>;
}

const getDocuments = (config: ReadonlyArray<Readonly<APIConfiguration>>, baseurl: string): Promise<Array<Document>> => Promise.all(config.map(
    async (api) => {
        const contentSummaries = await api.getApiContent().then((content) => {
            const paths = content.openapi.paths
            if (paths) {
                const pathSummaries = Object.entries(paths)
                .map(([path, pathObject]) => {
                    return Object.entries(pathObject)
                    .map(([method, methodInfo]) => {
                        return methodInfo.summary
                    })
                })
                return pathSummaries.flatMap(summaryArray => summaryArray.filter(summary => summary !== undefined))
            }
        })

        return {
            solr_command: "index",
            content_type: "documentation",
            id: api.id,
            uri: `${baseurl}/api/${api.id}`,
            name: `${api.displayName} | API Catalog and Documentation`,
            description: api.description,
            content_summaries: contentSummaries
        }}
    )
)

export const collector = async (config: ReadonlyArray<Readonly<APIConfiguration>>, baseurl: string): Promise<string> => {
    const documents = await getDocuments(config, baseurl)

    const collection: CanonicalFormat = {
        data_source: "dev_api_catalog",
        documents: documents
    }

    return JSON.stringify(collection)
}
