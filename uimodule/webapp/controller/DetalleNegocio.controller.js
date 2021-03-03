sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History"
], function (Controller, History) {
  "use strict";

  return Controller.extend("profertil.appCtaCorriente.controller.DetalleNegocio", {
    onInit: function () {
      // create the views based on the url/hash
         this.getRouter().initialize();
    },
    onNavBack: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMainView", true);
      }
    },
    formatRowHighlight: function (oValue) {
			// Your logic for rowHighlight goes here
			if (oValue == "SI" ) {
				return "Error";
			} else if (oValue == "NO") {
				return "Success";
			}
			return "Success";
		}

  });
});
