sap.ui.define([
  "profertil/appCtaCorriente/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function (Controller, History, Filter, FilterOperator, Fragment, MessageToast, JSONModel) {
  "use strict";
  var oController;
  return Controller.extend("profertil.appCtaCorriente.controller.DetalleCanje", {
    onInit: function () {
      // create the views based on the url/hash
      //this.getRouter().initialize();

      oController = this;
			oController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oController.oRouter.attachRouteMatched(oController._onRouteMatched, oController);

      var oViewModel = new JSONModel({
        EntrPendFijarUSDTotal: 0,
        EntrPendLiqUSDTotal: 0,
        LiqPendEntrUSDTotal: 0,
        PendEntregaUSDTotal: 0,
        EntrLiqTNTotal: 0,
        EntrPendFijarTNTotal: 0,
        EntrPendLiqTNTotal: 0,
        EntregadasTNTotal: 0,
        LiqNoEnrTNTotal: 0,
        PendEntrTNTotal: 0,
        TotalesTNTotal: 0,
        visibleUSD: true,
        visibleTN: false,
      });
      this.setModel(oViewModel, "Totalizados");

      this.press = false;
    },

    _onRouteMatched: function(){
       var clienteA = this.getModel("ModelEstadoGral").getData().ModelEstadoGral.Kunnr;
      if (clienteA != this.clienteB){
        this.clienteB = clienteA;
        this.getView().byId("detalleCanje").rebindTable();
      }
    },
    onSelectionChange: function(){
      var oSegmentedButton = this.byId("SB1"),
      visibleColumn  = oController.getView().byId("detalleCanjeTabla").getColumns(),
       oSelectedItemId = oSegmentedButton.getSelectedKey(),
       oViewModel = this.getModel("Totalizados"),
       columnas;
      if (oSelectedItemId == "USD"){
       oViewModel.setProperty("/visibleUSD", true);
      oViewModel.setProperty("/visibleTN", false);
      }
      else if (oSelectedItemId == "TN")
      {
      oViewModel.setProperty("/visibleTN", true);
       oViewModel.setProperty("/visibleUSD", false);
      }
      columnas = ({
                        columns: {
                                        columnsItems: [
                                                      {columnKey: "Contrato", visible: visibleColumn[0].getVisible() },
                                                      {columnKey: "ClaseDoc", visible: visibleColumn[1].getVisible() },
                                                      {columnKey: "NroComprobante", visible: visibleColumn[2].getVisible() },
                                                      {columnKey: "Fecha", visible: visibleColumn[3].getVisible() },
                                                      {columnKey: "Corredor", visible: visibleColumn[4].getVisible() },
                                                      {columnKey: "DescEspecie", visible: visibleColumn[5].getVisible() },
                                                      {columnKey: "Modalidad", visible: visibleColumn[6].getVisible() },
                                                      {columnKey: "Desde", visible: visibleColumn[7].getVisible() },
                                                      {columnKey: "Hasta", visible: visibleColumn[8].getVisible() },
                                                      {columnKey: "UsdEntrPendFijar", visible: oViewModel.getProperty("/visibleUSD") },
                                                      {columnKey: "UsdEntrPendLiqui", visible: oViewModel.getProperty("/visibleUSD") },
                                                      {columnKey: "UsdLiqNoEntregadas", visible: oViewModel.getProperty("/visibleUSD") },
                                                      {columnKey: "UsdPend", visible: oViewModel.getProperty("/visibleUSD") },

                                                      {columnKey: "TnPactadas", visible: oViewModel.getProperty("/visibleTN")},
                                                      {columnKey: "TnEntregadas", visible: oViewModel.getProperty("/visibleTN")},
                                                      {columnKey: "TnEntrLiquidadas", visible: oViewModel.getProperty("/visibleTN") },
                                                      {columnKey: "TnEntrPendFijar", visible: oViewModel.getProperty("/visibleTN")},
                                                      {columnKey: "TnEntrPendLiqui", visible: oViewModel.getProperty("/visibleTN")},
                                                      {columnKey: "TnLiqNoEntregadas", visible: oViewModel.getProperty("/visibleTN")},
                                                      {columnKey: "TnPteEnt", visible: oViewModel.getProperty("/visibleTN")},

                          ]
                                    }
                    });
      this.getView().byId("detalleCanje").applyVariant(columnas);
    },

    onUpdateFinished: function (oEvent){
      var Epfu = 0;
      var Eplu = 0;
      var Lpeu = 0;
      var Peu = 0;

      var Elt = 0;
      var Epft = 0;
      var Eplt = 0;
      var Ent = 0;
      var Lnt = 0;
      var Pet = 0;
      var Tot = 0;
      var oViewModel = this.getModel("Totalizados");

      var i;

      const isGroupHeader = (oItem) => {
          return oItem instanceof sap.m.GroupHeaderListItem;
        };


      var oTable = oEvent.getSource(),
          aItems = oTable.getItems(),
          aEntities = aItems.filter((oItem) => !isGroupHeader(oItem)).map((oItem) => oItem.getBindingContext().getObject());

      for (i = 0; i < aEntities.length; i++)
      {
        Epfu = parseFloat(aEntities[i].UsdEntrPendFijar) + parseFloat(Epfu);
        Eplu = parseFloat(aEntities[i].UsdEntrPendLiqui) + parseFloat(Eplu);
        Lpeu = parseFloat(aEntities[i].UsdLiqNoEntregadas) + parseFloat(Lpeu);
        Peu = parseFloat(aEntities[i].UsdPend) + parseFloat(Peu);

        Elt = parseFloat(aEntities[i].TnEntrLiquidadas) + parseFloat(Elt);
        Epft = parseFloat(aEntities[i].TnEntrPendFijar) + parseFloat(Epft);
        Eplt = parseFloat(aEntities[i].TnEntrPendLiqui) + parseFloat(Eplt);
        Ent = parseFloat(aEntities[i].TnEntregadas) + parseFloat(Ent);
        Lnt = parseFloat(aEntities[i].TnLiqNoEntregadas) + parseFloat(Lnt);
        Pet = parseFloat(aEntities[i].TnPteEnt) + parseFloat(Pet);
        Tot = parseFloat(aEntities[i].TnPactadas) + parseFloat(Tot);
      }

      oViewModel.setProperty("/EntrPendFijarUSDTotal", parseFloat(Epfu).toFixed(2));
      oViewModel.setProperty("/EntrPendLiqUSDTotal", parseFloat(Eplu).toFixed(2));
      oViewModel.setProperty("/LiqPendEntrUSDTotal", parseFloat(Lpeu).toFixed(2));
      oViewModel.setProperty("/PendEntregaUSDTotal", parseFloat(Peu).toFixed(2));

      oViewModel.setProperty("/EntrLiqTNTotal", parseFloat(Elt).toFixed(2));
      oViewModel.setProperty("/EntrPendFijarTNTotal", parseFloat(Epft).toFixed(2));
      oViewModel.setProperty("/EntrPendLiqTNTotal", parseFloat(Eplt).toFixed(2));
      oViewModel.setProperty("/EntregadasTNTotal", parseFloat(Ent).toFixed(2));
      oViewModel.setProperty("/LiqNoEnrTNTotal", parseFloat(Lnt).toFixed(2));
      oViewModel.setProperty("/PendEntrTNTotal", parseFloat(Pet).toFixed(2));
      oViewModel.setProperty("/TotalesTNTotal", parseFloat(Tot).toFixed(2));

     this.oColumnLstItem = new sap.m.ColumnListItem({
      cells: [
          new sap.m.ObjectIdentifier({title: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.Text({text: ""}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntrPendFijarUSDTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntrPendLiqUSDTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/LiqPendEntrUSDTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/PendEntregaUSDTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),

          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/TotalesTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntregadasTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntrLiqTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntrPendFijarTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/EntrPendLiqTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/LiqNoEnrTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),
          new sap.m.ObjectIdentifier({title: "{path: 'Totalizados>/PendEntrTNTotal', type:'sap.ui.model.type.Float', formatOptions : { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2}}"}),

     ]

    });
      if (aItems.length > 0){
      var aTable = this.getView().byId("detalleCanjeTabla");
      aTable.addItem(this.oColumnLstItem);
      }
    },

    onPressNegocio: function (oEvent) {
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      this.Contrato = oTabla.Contrato;
      if (!this._oValueHelpDialogA) {
        Fragment.load({
          name: "profertil.appCtaCorriente.fragments.detalleDocumentos",
          controller: this
        }).then(function (oValueHelpDialog) {
          this._oValueHelpDialogA = oValueHelpDialog;
          this.getView().addDependent(this._oValueHelpDialogA);
          this._oValueHelpDialogA.open();
          this.filtrarDocumentos();
        }.bind(this));

      } else {
        this._oValueHelpDialogA.open();
        this.filtrarDocumentos();
      }
    },

    onPdfDocumento: function (oEvent) {
      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();
      var sPath = ruta + "/PrinterSet(TipoDoc='CON',Documento='" + oTabla.Contrato + "')/$value";
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

    onPressEntregas: function (oEvent) {

      var oModel = this.getView().getModel("relatedDocs");
      var ruta = oModel.sServiceUrl;
      var oTabla = oEvent.getSource().getBindingContext().getObject();

      var sPath = ruta + "/PrinterSet(TipoDoc='REM',Documento='" + oTabla.belnr + "')/$value";
      var o = window.open(sPath, "_blank");
      if (o == null) {
        MessageToast.show("Documento no encontrado");
      }
    },

    filtrarDocumentos: function () {
      sap.ui.getCore().byId("detalleDocs").rebindTable();
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

    onBeforeRebindTable: function (oEvent) {
    var aTable = this.getView().byId("detalleCanjeTabla");
    var oViewModel = this.getModel("Totalizados");
      if (this.oColumnLstItem){
        aTable.removeItem(this.oColumnLstItem);
      }
      //var date = this.getView().byId("DP1").getDateValue();

      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      //if (date) {
      //  oBindingParams.filters.push(new Filter("FechaSaldo", FilterOperator.LE, date));
      //}

      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));
    },
    onBeforeRebindTableDocs: function (oEvent) {
      var cliente = this.getOwnerComponent().getModel("oModelCliente").getData().Cliente;
      var oBindingParams = oEvent.getParameter("bindingParams");
      oBindingParams.filters.push(new Filter("Kunnr", FilterOperator.EQ, cliente));

      oBindingParams.filters.push(new Filter("Contrato", FilterOperator.EQ, this.Contrato));
    },

    onCancelarDcumentos: function () {
      var oSmtFilter = sap.ui.getCore().byId("smartFilterBarDocs");
      this._oValueHelpDialogA.close();
      oSmtFilter.getControlByKey("NroComprobante").setValue("");
      oSmtFilter.getControlByKey("carta_de_porte").setValue("");
    },

    onChangeFechaSaldoCereal: function (oEvent) {
      this.getView().byId("detalleCanje").rebindTable();
    },

    onBeforeExport: function (oEvent){
      oEvent.getParameter("exportSettings").worker = false;
    }
  });
});

