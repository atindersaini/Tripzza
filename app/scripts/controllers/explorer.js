'use strict';

/**
 * @ngdoc function
 * @name itemMirrorAngularDemoApp.controller:ExplorerCtrl
 * @description
 * # ExplorerCtrl
 * Controller of the itemMirrorAngularDemoApp
 */
angular.module('itemMirrorAngularDemoApp')
  .controller('ExplorerCtrl', function ($scope, $rootScope, itemMirror, $modal) {
    // starts everything up after dropbox loads5
   $scope.animationsEnabled = true;

   angular.element(document).ready(function () {

      if (! localStorage.justOnce) {
        localStorage.setItem("justOnce", "true");
        window.location.reload();
    }
    });

  $scope.open = function (size) {
    
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/frame.html',
      controller: 'FrameInstanceCtrl',
      //size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });    
  };

  // $scope.toggleAnimation = function () {
  //   $scope.animationsEnabled = !$scope.animationsEnabled;
  // };
   
    var init = itemMirror.initialize;
    init.then(function() {
      
      $scope.mirror = itemMirror;
      $scope.associations = itemMirror.associations;
      $scope.selectedAssoc = null;

      // This needs to be called after the service updates the associations.
      // Angular doesn't watch the scope of the service's associations, so any
      // updates don't get propogated to the front end.
      function assocScopeUpdate() {
        $scope.associations = itemMirror.associations;
        $scope.selectedAssoc = null;
       }
       var delFlag;
      $scope.deleteAssoc = function(guid) {
        delFlag=confirm("Are you sure you want to DELETE?");
        if(delFlag){
          itemMirror.deleteAssociation(guid).
          then(assocScopeUpdate);
        }
      };

      $scope.navigate = function(guid) {
        itemMirror.navigateMirror(guid).
        then(assocScopeUpdate);
      };

      $scope.previous = function() {
        itemMirror.previous().
        then(assocScopeUpdate);
      };

      $scope.save = function() {
        itemMirror.save().
        then(assocScopeUpdate);
      };

      $scope.refresh = function() {
        itemMirror.refresh().
        then(assocScopeUpdate);
      };

      // Only one association is ever selected at a time. It has the boolean
      // selected property, to allow for unique styling
      $scope.select = function(assoc) {
        if ($scope.selectedAssoc) {
          $scope.selectedAssoc.selected = false;
        }
        $scope.selectedAssoc = assoc;
        $scope.selectedAssoc.selected = true;
      };

      // Phantom Creation Section

      // This is used to intially set the values, and reset them after we create a phantom.
      // We don't want the same information stuck in those boxes after creating them
      function resetPhantomRequest() {
        $scope.phantomRequest.displayText = '';
        $scope.phantomRequest.itemURI = '';
        $scope.phantomRequest.localItemRequested = false;
      }

      $scope.phantomRequest = {};
      resetPhantomRequest();

      $scope.createPhantom = function() {
        itemMirror.createAssociation($scope.phantomRequest).
        then( function() {
          switchToAssocEditor();
          assocScopeUpdate();
          resetPhantomRequest();
        });
      };

      // Folder Creation Section, nearly the exact same as the phantom request,
      // with a few minor differences
      function resetFolderRequest() {
        $scope.folderRequest.displayText = '';
        $scope.folderRequest.localItem = '';
        $scope.folderRequest.isGroupingItem = true;
      }

      $scope.folderRequest = {};
      resetFolderRequest();

      $scope.createFolder = function() {
        itemMirror.createAssociation($scope.folderRequest).
        then( function() {
          switchToAssocEditor();
          assocScopeUpdate();
          resetFolderRequest();
        });
      };


      // default section for our editing panel
      function switchToAssocEditor() {
        $scope.editSection = 'assoc-editor';
      }

      switchToAssocEditor();

      // Function used to show display text succinctly
      $scope.matchFirstLn = function(str) {
        var first = /.*/;
        return first.exec(str)[0];
      };

      $scope.linksList = [];
        $scope.arrPush = function(myClickedLink){
            $scope.linksList.push(myClickedLink);
          }

      $scope.clickFunc = function (event) {
        
//        debugger;
        if(event.target.getAttribute('data-ctorig')) {
          var myClickedLink = event.target.getAttribute('data-ctorig');

        } else if((event.target).parent().attr('data-ctorig')) {
          var myClickedLink = $(event.target).parent().attr('data-ctorig');
        }
        globalLink=myClickedLink;
        //debugger;
        if(event){
          event.stopPropagation();
          event.preventDefault();
        }

       // alert(myClickedLink);
      
        var flag = true;
        var disptext;
        
        // debugger;
        for(var i=0 ; i <= $scope.linksList.length; i++) {
            if(flag && myClickedLink != null) {
             
              if($scope.linksList[i] == myClickedLink){
             
              alert("The link you are trying to save exists in the current folder");
              flag = false;
              }
              else
              {
                /*debugger;
              $scope.arrPush(myClickedLink);
              debugger;
             */
              disptext = prompt("Please enter link description:","Saved Link");
              if(disptext)
              {
                $scope.arrPush(myClickedLink);
              }  
              flag = false;
              }
          }
        } 

        
      //  $scope.phantomRequest.displayText = myClickedLink;
      //  $scope.phantomRequest.localItem = myClickedLink;
      //  $scope.phantomRequest.isGroupingItem = true;
       
       // debugger;
       // $scope.modal=modal;
       // $scope.modal = !$scope.modal;
       // // $scope.dataname="#myModal";
       // debugger;
      //$scope.open();
       //var disptext = prompt("Please enter link description:","Saved Link");
       //$scope.dt=dispText;
      // debugger;
       if( disptext != null){
         var  createAssociationCase2Options = {
         "displayText": disptext,
         "itemURI":  myClickedLink
       };
      // debugger;
      //  // create a for loop to check all associations present in current scope 
      //  // validate those against the above newly created options
      
      //  debugger;
         itemMirror.createAssociation(createAssociationCase2Options).
        then( function() {
          switchToAssocEditor();
          assocScopeUpdate();
          resetPhantomRequest();


       });
      //  debugger;
        
         };
      };

    });

  });

angular.module('itemMirrorAngularDemoApp')
.controller('FrameInstanceCtrl', function ($scope, $modalInstance, items) {

  //$scope.newUrlProps = newUrlProperties;
  //$scope.newPane = {};  
  
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

// $scope.addFields = function () {  
//   $scope.newUrlProps.push({title:'',url:''});  
// }
    
  // $scope.removeChoice = function() {
  //   var lastItem = $scope.newUrlProps.length-1;
  //   $scope.newUrlProps.splice(lastItem);
  // };

  function Ctrl2($scope, sharedProperties) {
    $scope.both = sharedProperties.setUrlProperty($scope.newUrlProps);
}

var newPaneProperties= [];
$scope.createNewPane = function(newPane) {
  // alert(newPane);
  // alert(newUrlProps);
  debugger;
//  $scope.newUrlProps.push({title:'',url:''});  
//  $scope.newPaneProperties.push({section: newPane.sectionTitle, urlProperties: [title: newUrlProps.title, url: newUrlProps.url]})
// alert(newPaneProperties);
//  debugger;
//$scope.text=disptext;
disptext=newPane.sectionTitle;
debugger;
    $scope.newPane = {};
 $scope.ok();
 };

});
var globalLink;