sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, History, Filter, FilterOperator) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCheques", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();


      oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);
    },

    _onRouteMatched: function(){
       var clienteA = this.getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
      if (clienteA != this.clienteB){
        this.clienteB = clienteA;
        this.getView().byId("chequeTabla").rebindTable();
      }
    },


    onBeforeRebindTable: function (oEvent) {
      var date = this.getView().byId("DP1").getDateValue();
      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      if (date) {
        oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, date));
      }

      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));
    },

    onChangeFechaSaldoCheques: function (oEvent) {
      this.getView().byId("chequeTabla").rebindTable();
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
    onBeforeExport: function (oEvent){
      oEvent.getParameter("exportSettings").worker = false;
    }
  });
});
