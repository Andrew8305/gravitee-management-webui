import ApplicationService from "../services/applications.service";

export default applicationsConfig;

function applicationsConfig($stateProvider: ng.ui.IStateProvider) {
  'ngInject';
  $stateProvider
    .state('applications', {
      url: '/applications',
      templateUrl: 'app/application/applications.html',
      abstract: true,
      parent: 'withSidenav'
    })
    .state('applications.list', {
      url: '/',
      templateUrl: 'app/application/applicationsList.html',
      controller: 'ApplicationsController',
      controllerAs: 'applicationsCtrl',
      resolve: {
        resolvedApplications: (ApplicationService: ApplicationService) => ApplicationService.list()
      },
      data: {
        menu: {
          label: 'Applications',
          icon: 'list',
          firstLevel: true,
          order: 20
        },
        devMode: true
      }
    })
    .state('applications.portal', {
      abstract: true,
      url: '/:applicationId',
      templateUrl: 'app/application/details/applicationDetail.html',
      controller: 'ApplicationController',
      controllerAs: 'applicationCtrl',
      resolve: {
        resolvedApplication: function ($stateParams, ApplicationService) {
          return ApplicationService.get($stateParams.applicationId);
        }
      }
    })
    .state('applications.portal.general', {
      url: '/general',
      templateUrl: 'app/application/details/general/applicationGeneral.html',
      controller: 'ApplicationGeneralController',
      controllerAs: 'applicationGeneralCtrl',
      data: {
        menu: {
          label: 'Global settings',
          icon: 'blur_on'
        },
        devMode: true
      }
    })
    .state('applications.portal.subscriptions', {
      url: '/subscriptions',
      templateUrl: 'app/application/details/subscriptions/applicationSubscriptions.html',
      controller: 'ApplicationSubscriptionsController',
      controllerAs: 'applicationSubscriptionsCtrl',
      resolve: {
        resolvedSubscriptions: function ($stateParams, ApplicationService) {
          return ApplicationService.listSubscriptions($stateParams.applicationId);
        }
      },
      data: {
        menu: {
          label: 'Subscriptions',
          icon: 'vpn_key'
        },
        devMode: true
      }
    })
    .state('applications.portal.members', {
      url: '/members',
      templateUrl: 'app/application/details/members/applicationMembers.html',
      controller: 'ApplicationMembersController',
      controllerAs: 'applicationMembersCtrl',
      resolve: {
        resolvedMembers: function ($stateParams, ApplicationService) {
          return ApplicationService.getMembers($stateParams.applicationId);
        }
      },
      data: {
        menu: {
          label: 'Members',
          icon: 'group'
        },
        devMode: true
      }
    })
    .state('applications.portal.analytics', {
      url: '/analytics?from&to',
      templateUrl: 'app/application/details/analytics/analytics.html',
      controller: 'ApplicationAnalyticsController',
      controllerAs: 'analyticsCtrl',
      data: {
        menu: {
          label: 'Analytics',
          icon: 'insert_chart'
        },
        devMode: true
      }
    })
}
