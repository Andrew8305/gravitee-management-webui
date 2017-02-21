import ApplicationService from "../services/applications.service";
import GroupService from "../services/group.service";

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
        resolvedApplications: (ApplicationService: ApplicationService) =>
          ApplicationService.list().then(response => response.data)
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
        resolvedApplication: ($stateParams: ng.ui.IStateParamsService, ApplicationService: ApplicationService) =>
          ApplicationService.get($stateParams['applicationId']).then(response => response.data)
      }
    })
    .state('applications.portal.general', {
      url: '/general',
      templateUrl: 'app/application/details/general/applicationGeneral.html',
      controller: 'ApplicationGeneralController',
      controllerAs: '$ctrl',
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
      controllerAs: '$ctrl',
      resolve: {
        resolvedSubscriptions: ($stateParams: ng.ui.IStateParamsService, ApplicationService: ApplicationService) =>
          ApplicationService.listSubscriptions($stateParams['applicationId']).then(response => response.data)
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
      controllerAs: '$ctrl',
      resolve: {
        resolvedMembers: ($stateParams: ng.ui.IStateParamsService, ApplicationService: ApplicationService) =>
          ApplicationService.getMembers($stateParams['applicationId']).then(response => response.data),
        resolvedGroupMembers: ($stateParams: ng.ui.IStateParamsService, resolvedApplication: any, GroupService: GroupService) =>
          (resolvedApplication.group &&
          resolvedApplication.group.id &&
          GroupService.getMembers(resolvedApplication.group.id).then(response => response.data))
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
      controllerAs: '$ctrl',
      data: {
        menu: {
          label: 'Analytics',
          icon: 'insert_chart'
        },
        devMode: true
      }
    })
}
