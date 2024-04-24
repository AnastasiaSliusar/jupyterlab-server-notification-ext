import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
import re

class RouteHandler(APIHandler):

    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        if input_data["data"]["with_validation"] !="":
            isValid = re.search("(?=.*?[0-9]).{8,}", input_data["data"]["with_validation"])
            if isValid == None:
                self.event_logger.emit(
                    schema_id="http://event.mockextension.jupyter.org/message",
                    data={"event_message":"This {} is not valid, it should contain more than 8 letters and 1 number at least ".format(input_data["data"]["with_validation"]), "label": "Error",  "status": "error", "event_type":"analytic"}
                )
            else:
                if input_data["data"]["required"] == "":
                    self.event_logger.emit(
                        schema_id="http://event.mockextension.jupyter.org/message",
                        data={"event_message":"Please fill required field", "label": "Error",  "status": "error", "event_type":"analytic"}
                    )
                else:
                    if input_data["data"]["optional"] != "":
                        self.event_logger.emit(
                            schema_id="http://event.mockextension.jupyter.org/message",
                            data={"event_message":"Everything is correct", "label": "Congratulations",  "status": "success", "event_type":"analytic"}
                        )
                    else:
                        self.event_logger.emit(
                            schema_id="http://event.mockextension.jupyter.org/message",
                            data={"event_message":"It is recomended to fill an optional field", "label": "Warning",  "status": "warning", "event_type":"analytic"}
                        )
        # Emit an event.
 
def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-server-notification-ext", "event")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
