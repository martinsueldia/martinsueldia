sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter) {
        "use strict";
        var oController;

        return Controller.extend("profertil.appCtaCorriente.controller.FacturadaPagada", {
            formatter: formatter,
            onInit: function () {
                oController = this;
                oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
            },
            _onRouteMatched: function () {
              this.byId("expContent").mObjectBindingInfos.MercaderiaPendiente.binding.refresh();
              var clienteA = this.getOwnerComponent().getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
              if (clienteA != this.clienteB){
                this.clienteB = clienteA;
                this.getView().byId("idSmartTable").rebindTable();
              }
            },
            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("");
            },
            onBeforeExport: function (oEvent) {
                /* Deshabilitar export worker */
                oEvent.getParameter("exportSettings").worker = false;
            }
        });
    });
