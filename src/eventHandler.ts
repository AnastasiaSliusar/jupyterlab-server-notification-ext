import { URLExt } from '@jupyterlab/coreutils';
import { Event, ServerConnection } from '@jupyterlab/services';
import { Notification } from '@jupyterlab/apputils';

interface IOptionRequest {
  body: string;
  method: 'POST' | 'PUT' | 'DELETE';
};

interface INotification {
  /**
   * The status of backend.
   */
  status: "error" | "success" | "warning" | "info";

  /**
   * Message information for a notification.
   */
  message: {
    /**
     * Notification title.
     */
    title: string;

    /**
     * Notification detailed information.
     */
    description?: string;
  };

  /**
   * Notification label.
   */
  label: string;

  /**
   * Show detailed information for a notification.
   */
  callback?: ()=>void;

  /**
   * Milliseconds of notification delay
   */
  delay: number;
}

export interface IEventHandler {
  /**
   * Setup a flag for showing notification
   */
  activateNotification:(flag: boolean)=>void

  /**
   * Make REST API request for through EventManager
   */
  data: (endPoint: string, apiNamespace: string, options?: IOptionRequest) => void

  /**
   * Show notification
   */
  showNotification: (obj: INotification) => void
}

export class EventHandler implements IEventHandler {
  private eventManager: Event.IManager;
  activeNotification: boolean;

  constructor(eventManager: Event.IManager) {
    this.eventManager = eventManager;
    this.activeNotification = false;
  }

  activateNotification(flag: boolean): void {
    this.activeNotification = flag;
  }

  data(endPoint: string, apiNamespace: string, options?: IOptionRequest): void {
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

 showNotification = ({
    status,
    message,
    label,
    callback,
    delay
  }: INotification): void => {
    let actions  = callback ? [
        { label, callback: callback}
      ]: undefined;

    Notification[status](message.title, {
      actions,
      autoClose: delay
    });
  };
}
