import { ReactWidget } from '@jupyterlab/ui-components';

import React from 'react';
//import { Notification } from '@jupyterlab/apputils';
import { Event } from '@jupyterlab/services';
import { StatisticService } from './statistic';

export interface INotification {
  /**
   * The status of backend.
   */
  status: 'success' | 'error';

  /**
   * Message information for a notification.
   */
  message: {
    /**
     * Notification message.
     */
    text: 'string';

    /**
     * notification detailed information.
     */
    details: 'string';
  };

  /**
   * Milliseconds of notification delay
   */
  delay: number;
}

/**
 * Button component which is used to show notification and sending requests to backend.
 *
 * @returns The React component
 */
const ButtonComponent = (props: {statisticService: StatisticService}): JSX.Element => {
  //const [data, setData] = useState({});
  const statisticService = props.statisticService;


 /* const showNotification = ({
    status,
    message,
    delay
  }: INotification): void => {
    Notification[status](message.text, {
      actions: [
        { label: 'More information', callback: () => alert(message.details) }
      ],
      autoClose: delay
    });
  };*/

  const handleClick = (): void => {
    let analyticData = {
      "type":"jupterlab_analytics",
      "action": "button_click",
      "name": "button_react"
    }
    statisticService.data("event", "mock", {
      "body": JSON.stringify(analyticData),
      "method": 'POST'
    });

   /* eventManager.emit({data: {"event_message": "Test from frontend!"},  schema_id:"http://event.mockextension.jupyter.org/message", version:"1"});
    makeEventRequestAPI<any>('event', eventManager.serverSettings)
      .then(data => {
        console.log('makeEventRequestAPI');
        //showNotification(data);
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_server_notification_ext server extension appears to be missing.\n${reason}`
        );
      });
      */
      
  };

  return (
    <div>
      <p>You will see notifications after clicking</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

/**
 * A Button Lumino Widget that wraps a ButtonComponent.
 */
export class ButtonWidget extends ReactWidget {
  statisticService: StatisticService;
  /**
   * Constructs a new ButtonWidget.
   */
  constructor(eventManager: Event.IManager, statisticService: StatisticService) {
    super();
    this.addClass('jp-react-widget');
    this.statisticService = statisticService
  }

  render(): JSX.Element {
    return <ButtonComponent statisticService={this.statisticService}/>;
  }
}
