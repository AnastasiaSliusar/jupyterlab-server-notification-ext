import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

//import { requestAPI } from './handler';


import { MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { reactIcon } from '@jupyterlab/ui-components';
import { CounterWidget } from './widget';

/**
 * The command IDs used by the react-widget plugin.
 */
namespace CommandIDs {
  export const create = 'create-react-widget';
}

/**
 * Initialization data for the jupyterlab-server-notification-ext extension.
 
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
*/

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_server_notification_ext/',
  description: 'A JupyterLab extention to show notification after clicking on a button',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    console.log('JupyterLab extension jupyterlab-server-notification-ext is activated!');
    const { commands } = app;

    const command = CommandIDs.create;
    commands.addCommand(command, {
      caption: 'Create a new React Widget',
      label: 'React Widget',
      icon: args => (args['isPalette'] ? undefined : reactIcon),
      execute: () => {
        const content = new CounterWidget();
        const widget = new MainAreaWidget<CounterWidget>({ content });
        widget.title.label = 'React Widget';
        widget.title.icon = reactIcon;
        app.shell.add(widget, 'main');
      }
    });

   if (launcher) {
     launcher.add({
       command
     });
    }
  }
};


export default extension;
