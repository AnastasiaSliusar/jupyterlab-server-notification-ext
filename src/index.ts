import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab-server-notification-ext extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-server-notification-ext:plugin',
  description: 'A JupyterLab extention to show notification after clicking on a button',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-server-notification-ext is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_server_notification_ext server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
