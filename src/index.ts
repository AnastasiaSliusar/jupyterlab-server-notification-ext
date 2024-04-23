import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

//import { requestAPI } from './handler';


import { MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { reactIcon } from '@jupyterlab/ui-components';
import { ButtonWidget } from './widget';
import { StatisticService } from './statistic';

/**
 * The command IDs used by the react-widget plugin.
 */
namespace CommandIDs {
  export const create = 'create-react-widget';
}


const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_server_notification_ext/',
  description: 'A JupyterLab extention to show notification after clicking on a button',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    console.log('JupyterLab extension jupyterlab-server-notification-ext is activated!');
    const { commands } = app;

    const command = CommandIDs.create;
    const statisticService = new StatisticService(app.serviceManager.events);
   
    app.serviceManager.events.stream.connect((_, emission) => {
      console.log('signal emission', emission);
      if (emission.event_type === 'analytic') {

      }
    });

    commands.addCommand(command, {
      caption: 'Create a React Button Notification Widget',
      label: 'React Button Notification Widget',
      icon: args => (args['isPalette'] ? undefined : reactIcon),
      execute: () => {
        const content = new ButtonWidget(app.serviceManager.events, statisticService);
        const widget = new MainAreaWidget<ButtonWidget>({ content });
        widget.title.label = 'React Button Notification Widget';
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
