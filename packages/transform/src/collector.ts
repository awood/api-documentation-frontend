import { Group } from '@apidocs/discovery';

const APIBASEURL = "https://developers.redhat.com/api-catalog"

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

export const discoveryCollector = (content: Array<Group>): string => {
    const documents: Array<Document> = content.flatMap(group => group.apps
        .filter(app => !app.skip && app.apiType === "openapi-v3")
        .map((app) => {
            return {
                solr_command: "index",
                content_type: "documentation",
                id: app.id,
                uri: `${APIBASEURL}/api/${app.id}`,
                name: `${app.name} | API Catalog and Documentation`,
                description: app.description
            }
        })
    )

    const collection: CanonicalFormat = {
        data_source: "dev_api_catalog",
        documents: documents
    }

    return JSON.stringify(collection)
}
