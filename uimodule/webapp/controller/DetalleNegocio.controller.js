sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], function (Controller, History, Filter, FilterOperator, MessageToast) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleNegocio", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();

       oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
    },

    _onRouteMatched: function(){
      this.getView().byId("negocioTabla").rebindTable();
    },

    onNavBack: function () {
      var sPreviousHash = History.getInstance().getPreviousHash();

      if (sPreviousHash !== undefined) {
        history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteMainView", {}, true);
      }
    },

    onPdfDocumentoNegocio: function (oEvent) {

      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var sPath = ruta + "/PrinterSet(TipoDoc='CON',Documento='" + oTabla.Vbeln + "')/$value//";
      var o = window.open(sPath, "_blank");
       if (o == null) {
          MessageToast.show("Ducumento no encontrado");
        }
    },

    onPressNegocio: function (oEvent) {
      if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
        var oTabla = oEvent.getSource().getBindingContext().getObject();
        var item = oTabla.Vbeln;
        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
          target: {
            shellHash: "DocumentosRel-display?&/Documento/CON," + item
             }
        });
      }
    },

    onBeforeRebindTable: function (oEvent) {
      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));
    },


    formatRowHighlight: function (oValue) {
      // Your logic for rowHighlight goes here
      if (oValue == "SI") {
        return "Error";
      } else if (oValue == "NO") {
        return "Success";
      }
      return "Success";
    }

  });
});
