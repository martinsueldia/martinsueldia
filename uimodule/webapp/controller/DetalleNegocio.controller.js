sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function (Controller, History, Filter, FilterOperator, MessageToast, JSONModel) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleNegocio", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();

       oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);

      var oViewModel = new JSONModel({
        Negociado: 0,
        Cupo: 0,
        Saldo: 0,
        Valor: 0,
      });
      this.setModel(oViewModel, "Totalizados");
    },

    _onRouteMatched: function(){
       var clienteA = this.getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
      if (clienteA != this.clienteB){
        this.clienteB = clienteA;
        this.getView().byId("negocioTabla").rebindTable();
      }
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

      onUpdateFinished: function (oEvent){
      var Zmeng = 0;
      var CupoSinFact = 0;
      var Saldo = 0;
      var Valor = 0;
      var oViewModel = this.getModel("Totalizados");

      const isGroupHeader = (oItem) => {
          return oItem instanceof sap.m.GroupHeaderListItem;
        };


      var oTable = oEvent.getSource(),
          aItems = oTable.getItems(),
          aEntities = aItems.filter((oItem) => !isGroupHeader(oItem)).map((oItem) => oItem.getBindingContext().getObject());

      for (var i = 0; i < aEntities.length; i++)
      {
        Zmeng = parseFloat(aEntities[i].Zmeng) + parseFloat(Zmeng);
        CupoSinFact = parseFloat(aEntities[i].CupoSinFact) + parseFloat(CupoSinFact);
        Saldo = parseFloat(aEntities[i].Saldo) + parseFloat(Saldo);
        Valor = parseFloat(aEntities[i].Valor) + parseFloat(Valor);
      }

      oViewModel.setProperty("/Negociado", parseFloat(Zmeng).toFixed(2));
      oViewModel.setProperty("/Cupo", parseFloat(CupoSinFact).toFixed(2));
      oViewModel.setProperty("/Saldo", parseFloat(Saldo).toFixed(2));
      oViewModel.setProperty("/Valor", parseFloat(Valor).toFixed(2));

     this.oColumnLstItem = new sap.m.ColumnListItem({
      cells: [
     new sap.m.Text({text: ""}),
     new sap.m.ObjectIdentifier({title: ""}),
     new sap.m.Text({text: ""}),
     new sap.m.Text({text: ""}),
     new sap.m.Text({text: ""}),
     new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/Negociado', type:'sap.ui.model.type.Float', formatOptions : { roundingMode: 'away_from_zero', groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
     new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/Cupo', type:'sap.ui.model.type.Float', formatOptions : { roundingMode: 'away_from_zero', groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
     new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/Saldo', type:'sap.ui.model.type.Float', formatOptions : { roundingMode: 'away_from_zero', groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
     new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/Valor', type:'sap.ui.model.type.Float', formatOptions : { roundingMode: 'away_from_zero', groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
     ]
    });
      if (aItems.length > 0){
      var aTable = this.getView().byId("tablaNegocios");
      aTable.addItem(this.oColumnLstItem);
      }
    },

    onPdfDocumentoNegocio: function (oEvent) {
      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var sPath = ruta + "/PrinterSet(TipoDoc='CON',Documento='" + oTabla.Vbeln + "')/$value//";
      $.get({
            url: sPath,
            success: function () {
              // eslint-disable-next-line no-unused-vars
              var o = window.open(sPath, "_blank");
            }
        }).fail(function () {
            MessageToast.show("Documento no encontrado");
        });
    },

    onBeforeExport: function (oEvent){
      var columnDoc = oEvent.getParameter("exportSettings").workbook.columns;
      for (var i = 0; i < columnDoc.length; i++ ){
        if (columnDoc[i].label == "Doc")
        {
          columnDoc.splice(i, 1);
        }
      }
      oEvent.getParameter("userExportSettings").includeFilterSettings = true;
      oEvent.getParameter("userExportSettings").splitCells = true;
      oEvent.getParameter("exportSettings").worker = false;
    },

    onPressNegocio: function (oEvent) {
      if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
        var oTabla = oEvent.getSource().getBindingContext().getObject();
        var tipoDoc = "CON";
        var sPath = `DocumentosRel-display?&/Documento/${tipoDoc},${oTabla.Vbeln}`;
          var hash = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
          target: {
          shellHash: sPath
          }
        });
        var id = window.location.href.substring(window.location.href.indexOf("true&") + 5, window.location.href.lastIndexOf("&sap-startup"));
        var url = window.location.href.replace(id, "sap-ui-app-id=profertil.RelatedsDocs").split("#")[0] + hash ;
        //var url = urlH.replace("cp.portal/ui5appruntime.html", "site");
        sap.m.URLHelper.redirect(url, true);
      }
    },

    onBeforeRebindTable: function (oEvent) {
      var aTable = this.getView().byId("tablaNegocios");
      if (this.oColumnLstItem){
        aTable.removeItem(this.oColumnLstItem);
      }
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
