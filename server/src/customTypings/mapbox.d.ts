declare module '@mapbox/mapbox-sdk/services/uploads' {
    import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
    import MapiClient, { SdkConfig } from '@mapbox/mapbox-sdk/lib/classes/mapi-client';

    /*********************************************************************************************************************
     * Uploads Types
     *********************************************************************************************************************/
    export default function Uploads(config: SdkConfig | MapiClient): UploadsService;

    interface UploadsService {
        /**
         * List the statuses of all recent uploads.
         * @param config
         */
        listUploads(config: { reverse?: boolean }): MapiRequest;
        /**
         * Create S3 credentials.
         */
        createUploadCredentials(): MapiRequest;
        /**
         * Create an upload.
         * @param config
         */
        createUpload(config: { mapId: string; url: string; tilesetName?: string }): MapiRequest;
        /**
         * Get an upload's status.
         * @param config
         */
        // implicit any
        getUpload(config: { uploadId: string }): any;
        /**
         * Delete an upload.
         * @param config
         */
        // implicit any
        deleteUpload(config: { uploadId: string }): any;
    }

    interface S3Credentials {
        accessKeyId: string;
        bucket: string;
        key: string;
        secretAccessKey: string;
        sessionToken: string;
        url: string;
    }

    interface UploadResponse {
        complete: boolean;
        tileset: string;
        error?: any;
        id: string;
        name: string;
        modified: string;
        created: string;
        owner: string;
        progress: number;
    }
}