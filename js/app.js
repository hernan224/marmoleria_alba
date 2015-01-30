
'use strict';

var marmoleriaApp = angular.module("marmoleriaApp", ['ngRoute', 'dirPagination']);


marmoleriaApp.run(['$rootScope', function($root) {
    $root.$on('$routeChangeStart', function(e, curr, prev) {
        //if (curr.$$route && curr.$$route.resolve) {
            // Show a loading message until promises are not resolved
            $root.loadingView = true;
        //}
    });
    $root.$on('$routeChangeSuccess', function(e, curr, prev) {
        // Hide loading message
        $root.loadingView = false;
    });
}]);



/*** CONFIGURACIÓN ***/
// Configuración de las rutas
marmoleriaApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl	: 'tmpl/home.html'
            //controller 	: 'mainController'
        })
        .when('/empresa', {
            templateUrl : 'tmpl/empresa.html'
            //controller 	: 'aboutController'
        })
        .when('/trabajos/:id', {
            templateUrl : 'tmpl/trabajos.html',
            controller : 'TrabajosCtrl',
            resolve : {
                trabajos : function(trabajosService, $timeout){
                        return trabajosService.getTrabajos();

                }
            }
        })
        .when('/catalogo/:seccion/:id', {
            templateUrl : 'tmpl/catalogo.html',
            controller : 'CatalogoCtrl',
            resolve: {
                catalogo : function(catalogoService){

                    return catalogoService.getCatalogo();
                }
            }
        })
        .when('/contacto', {
            templateUrl : 'tmpl/contacto.html',
            controller 	: 'ContactoCtrl'
        })
        .when('/404', {
            templateUrl : 'tmpl/404.html'
            //controller 	: 'contactController'
        })

        .otherwise({
            redirectTo: '/404'
            //templateUrl : 'tmpl/404.html'
        });

});




/*** CONTROLADORES ***/

marmoleriaApp.controller("HeaderCtrl", function($rootScope, $scope, $location, testActivoService){

    $rootScope.$on("$routeChangeError", function () {
        $location.path('/404');
    });


    $scope.isActive = function (viewLocation, indice) {
      return testActivoService.testUrl(viewLocation, indice);
    };

});


marmoleriaApp.controller("CatalogoCtrl", function ($scope, $location, $routeParams, catalogo, testActivoService) {

    $scope.cat = catalogo.data;

    $scope.seccionID = $routeParams.seccion;

    $scope.subSecID = $routeParams.id;

    if (($scope.seccionID === 'marmoleria') || ($scope.seccionID === 'bronceria')){

        if ($scope.seccionID === 'marmoleria'){
            $scope.seccion = $scope.cat.marmoleria;
            $scope.navMarmoleria = true;
        }else{
            $scope.seccion = $scope.cat.bronceria;
            $scope.navMarmoleria = false;
        }

        $scope.subSeccion = $scope.seccion.secciones[$scope.subSecID];

        if (angular.isObject($scope.subSeccion)){

            $scope.catalogo = {
                tituloSeccion : $scope.subSeccion.tituloSeccion,
                tituloPadre : $scope.seccion.titulo,
                urlGeneral : 'img/catalogo' + $scope.seccion.path + $scope.subSeccion.path + '/',
                productos : $scope.subSeccion.productos
            }

        }else{
            $location.path('/404');

        }
    }else{
        $location.path('/404');
    }

    $scope.isActive = function (viewLocation, indice) {
        return testActivoService.testUrl(viewLocation, indice);
    };



    $scope.mostrarProducto = function(url, titulo){
        jQuery.fancybox.open({
            href: url,
            title: titulo
        });
    }

});


marmoleriaApp.controller("TrabajosCtrl", function($scope, $location, $routeParams, trabajos, testActivoService){

    $scope.seccionID = $routeParams.id;

    $scope.listaTrabajos = trabajos.data;

    $scope.urlGeneral = 'img/trabajos/';

    $scope.seccion = $scope.listaTrabajos.trabajos[$scope.seccionID];

    if (angular.isObject($scope.seccion)){

        $scope.trabajo = {
            tituloSeccion : $scope.seccion.titulo,
            //tituloPadre : $scope.seccion.titulo,
            urlTrabajo : $scope.urlGeneral + $scope.seccion.path,
            rel :  $scope.seccion.rel,
            listado : $scope.seccion.archivos
        }

    }else{
        $location.path('/404');

    }

    $scope.mostrarProducto = function(url){
        jQuery.fancybox.open({
            href: url
            //rel: rel
        });
    }

    //$scope.mostrarTrabajos = function(url, lista){
    //    var listaFotos = [];
    //
    //    angular.forEach(lista, function(value) {
    //        this.push(url + value);
    //    }, listaFotos);
    //
    //    jQuery.fancybox.open(listaFotos);
    //
    //};

    $scope.isActive = function (viewLocation, indice) {
        return testActivoService.testUrl(viewLocation, indice);
    };

});


marmoleriaApp.controller("ContactoCtrl", function($scope, $http, $timeout){

    $scope.mostrarMensaje = false;
    $scope.envioOK = false;
    $scope.resultadoMensaje = 'Mensajes de prueba';
    $scope.formData;
    $scope.submitButtonDisabled = false;
    $scope.submitted = false;

    $scope.submit = function(contactform){
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;

        if (contactform.$valid){

           $http({

               method : 'POST',
               url : 'php/contact.php',
               data : jQuery.param($scope.formData),
               headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

           }).success(function(data){
               console.log(data);
               $scope.mostrarMensaje = true;
               if(data.success){
                   $scope.submitButtonDisabled = true;
                   $scope.envioOK = true;
                   //LIMPIO EL FORMULARIO
                   $scope.resultadoMensaje = data.message;
                   $scope.formData.nombre="";
                   $scope.formData.email="";
                   $scope.formData.asunto="";
                   $scope.formData.mensaje="";

                   $scope.submitted = false;
                   //OCULTO EL MENSAJE
                   $timeout(function() {
                       $scope.mostrarMensaje = false;
                       $scope.resultadoMensaje = "";
                       $scope.submitButtonDisabled = false;
                   }, 3000);


               }else{
                   $scope.submitButtonDisabled = false;
                   $scope.envioOK = false;
                   $scope.resultadoMensaje = data.message;
               }
           })

        }else{
            $scope.mostrarMensaje = true;
            $scope.submitButtonDisabled = false;
            $scope.envioOK = false;
            $scope.resultadoMensaje = 'Por favor, complete correctamente todos los campos requeridos.';
        };
    };


});




/*** DIRECTIVAS ***/

marmoleriaApp.directive('tinyNav', function(){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){

            jQuery(element).tinyNav({
                header : 'Menú'
            });
        }
    };

});


marmoleriaApp.directive('owlCarousel', function(){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){

            jQuery(element).owlCarousel({
                singleItem: true,
                navigation: true,
                responsive: true
            });
        }
    };

});


marmoleriaApp.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'contain',
            'background-position' : 'center center',
            'background-repeat' : 'no-repeat',
            'height' : '200px',
            'width' : '200px'

        });
    };
});




/*** SERVICIOS ***/
//Cargar data como factoria
marmoleriaApp.factory('catalogoService', function($http) {

    var lista = {

        getCatalogo: function() {
            var promise = $http({ metod: 'GET', url: 'img/catalogo/catalogo.json'})
                                .success(function(data, status, header, config){
                                            return data
                                        });

            return promise;
        }
    }

    return lista;
});


marmoleriaApp.factory('trabajosService', function($http) {

    var lista = {

        getTrabajos: function() {
            var promise = $http({ metod: 'GET', url: 'img/trabajos/trabajos.json'})
                                .success(function(data, status, header, config){
                                            return data
                                        });

            return promise;
        }
    }

    return lista;
});

marmoleriaApp.factory('testActivoService', function($rootScope, $location){

    var probarActivo = {};

    probarActivo.testUrl = function (viewLocation, indice) {

        var pathArray = $location.path().split('/');

        if (viewLocation === pathArray[indice]){
            var activo = true;
        }else{
            var activo = false;
        }

        return activo;
    };

    return probarActivo

});