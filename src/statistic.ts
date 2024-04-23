import { URLExt } from '@jupyterlab/coreutils';
import { Event, ServerConnection } from '@jupyterlab/services';

type OptionRequest = {
  body: string;
  method: 'POST' | 'PUT' | 'DELETE';
};

//const schemaId = 'http://event.mockextension.jupyter.org/message';

export class StatisticService {
  private eventManager: Event.IManager;

  constructor(eventManager: Event.IManager) {
    this.eventManager = eventManager;
  }

  data(endPoint: string, apiNamespace: string, options?: OptionRequest) {
    this.#makeEventRequestAPI<any>(
      endPoint,
      options,
      this.eventManager.serverSettings,
      apiNamespace
    )
      .catch(reason => {
        console.error(
          `The jupyterlab_server_notification_ext server extension appears to be missing.\n${reason}`
        );
      });
  }

  async #makeEventRequestAPI<T>(
    endPoint = 'event',
    init: RequestInit = {},
    settings: ServerConnection.ISettings,
    apiNamespace = 'mock'
  ): Promise<T> {
    const requestUrl = URLExt.join(
      settings.baseUrl,
      apiNamespace,
      endPoint
    );

    let response: Response;
    try {
      console.log(`requestUrl-->${requestUrl}`);
      console.dir(init);
      response = await ServerConnection.makeRequest(requestUrl, init, settings);
    } catch (error) {
      throw new ServerConnection.NetworkError(error as any);
    }

    let data: any = await response.text();

    if (data.length > 0) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.log('Not a JSON response body.', response);
      }
    }

    if (!response.ok) {
      throw new ServerConnection.ResponseError(response, data.message || data);
    }

    return data;
  }

  showNotification(){
    console.log('notifications');
  }

  ///
}
