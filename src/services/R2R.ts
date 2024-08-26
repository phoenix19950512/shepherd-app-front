import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const limit = 10;
const filters = { tags: 'example' };
const settings = {};
class R2RClient {
  baseUrl =
    'https://sciphi-e758bc14-eb0c-44d6-a2e6-7bb48e1054e4-qwpin2swwa-ue.a.run.app';

  async uploadAndProcessFile(
    documentId,
    filePath,
    metadata = null,
    settings = null
  ) {
    const url = `${this.baseUrl}/upload_and_process_file/`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('document_id', documentId);
    formData.append('metadata', JSON.stringify(metadata || {}));
    formData.append('settings', JSON.stringify(settings || {}));

    const response = await axios.post(url, formData, {
      headers: formData.getHeaders()
    });
    return response.data;
  }

  private saveSearchResults(query: string, data: any) {
    const searchResults = localStorage.getItem('ragResult');

    const existingData = searchResults ? JSON.parse(searchResults) : {};

    // Associate the new data with the query and save
    existingData[query] = data;
    localStorage.setItem('ragResult', JSON.stringify(existingData));
  }

  // Load search results from localStorage
  private loadSearchResults(query: string): any | null {
    const searchResults = localStorage.getItem('ragResult');

    const existingData = searchResults ? JSON.parse(searchResults) : null;

    if (existingData && existingData[query]) {
      return existingData[query];
    }
    return null;
  }

  async addEntry(
    documentId,
    blobs,
    metadata = null,
    doUpsert = false,
    settings = null
  ) {
    const url = `${this.baseUrl}/add_entry/`;
    const data = {
      entry: {
        document_id: documentId,
        blobs: blobs,
        metadata: metadata || {}
      },
      settings: settings || { embedding_settings: { do_upsert: doUpsert } }
    };

    const response = await axios.post(url, data);
    return response.data;
  }

  async addEntries(entries, doUpsert = false, settings = null) {
    const url = `${this.baseUrl}/add_entries/`;
    const data = {
      entries: entries,
      settings: settings || { embedding_settings: { do_upsert: doUpsert } }
    };

    const response = await axios.post(url, data);
    return response.data;
  }

  async search(query, limit = 10, filters = null, settings = null) {
    const url = `${this.baseUrl}/search/`;
    const data = {
      query: query,
      filters: filters || {},
      limit: limit,
      settings: settings || {}
    };

    const response = await axios.post(url, data);
    return response.data;
  }

  async ragCompletion(
    query,
    limit = 10,
    filters = null,
    settings = null,
    generationConfig = null
  ) {
    if (!generationConfig) {
      generationConfig = {};
    }
    const stream = generationConfig.stream || false;

    if (stream) {
      throw new Error('To stream, use the `streamRagCompletion` method.');
    }

    const cachedResponse = this.loadSearchResults(query);
    if (cachedResponse) return cachedResponse;

    const url = `${this.baseUrl}/rag_completion/`;
    const data = {
      query: query,
      filters: filters || {},
      limit: limit,
      settings: settings || {},
      generation_config: generationConfig || {}
    };

    const response = await axios.post(url, data);
    this.saveSearchResults(query, response.data);
    return response.data;
    return response.data;
  }

  async streamRagCompletion(
    query,
    limit = 10,
    filters = null,
    settings = null,
    generationConfig = null
  ) {
    if (!generationConfig) {
      generationConfig = {};
    }
    const stream = generationConfig.stream || false;

    if (!stream) {
      throw new Error('`streamRagCompletion` method is only for streaming.');
    }

    const url = `${this.baseUrl}/rag_completion/`;
    const data = {
      query: query,
      filters: filters || {},
      limit: limit,
      settings: settings || {},
      generation_config: generationConfig || {}
    };

    const response = await axios.post(url, data, {
      responseType: 'stream'
    });

    return response.data;
  }

  async filteredDeletion(key, value) {
    const url = `${this.baseUrl}/filtered_deletion/`;
    const response = await axios.delete(url, {
      params: { key: key, value: value }
    });
    return response.data;
  }

  async getLogs() {
    const url = `${this.baseUrl}/logs`;
    const response = await axios.get(url);
    return response.data;
  }

  async getLogsSummary() {
    const url = `${this.baseUrl}/logs_summary`;
    const response = await axios.get(url);
    return response.data;
  }
}

export default R2RClient;
