/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import ApiService from "./services/api.service";
import ApplicationService from "./services/applications.service";
import DocumentationService from "./services/apiDocumentation.service";
import ViewService from "./services/view.service";
import InstancesService from "./services/instances.service";

function routerConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
  'ngInject';
  $stateProvider
    .state(
      'root',
      {
        abstract: true,
        template: "<gravitee-sidenav></gravitee-sidenav><md-content ui-view layout='column' flex></md-content>",
        params: {
          reducedMode: {
            type: "bool",
            value: true
          }
        }
      }
    )
    .state('home', {
      url: '/',
      redirectTo: 'apis.list',
      data: {
        devMode: true
      }
    })
    .state('apis.portal', {
      abstract: true,
      url: '/:apiId',
      templateUrl: 'app/api/portal/apiPortal.html',
      controller: 'ApiPortalController',
      controllerAs: 'apiCtrl',
      resolve: {
        resolvedApi: function ($stateParams, ApiService) {
          return ApiService.get($stateParams.apiId);
        }
      }
    })
    .state('apis.portal.pages', {
      url: '/pages',
      templateUrl: 'app/api/portal/documentation/apiPages.html',
      controller: 'ApiPortalPagesController',
      controllerAs: 'apiPortalPagesCtrl',
      resolve: {
        resolvedPages: function ($stateParams, DocumentationService) {
          return DocumentationService.list($stateParams.apiId);
        }
      },
      data: {
        menu: {
          label: 'Documentation',
          icon: 'insert_drive_file'
        },
        devMode: true
      }
    })
    .state('apis.portal.pages.page', {
      url: '/:pageId',
      templateUrl: 'app/api/portal/documentation/apiPage.html',
      controller: 'ApiPortalPageController',
      controllerAs: 'apiPortalPageCtrl',
      resolve: {
        resolvedPage: function ($state: ng.ui.IStateService, DocumentationService: DocumentationService) {
          return DocumentationService.get($state.params['apiId'], $state.params['pageId']);
        }
      },
      data: {
        devMode: true
      }
    })
    .state('apis.portal.plans', {
      url: '/plans',
      templateUrl: 'app/api/portal/plan/apiPlans.html',
      controller: 'ApiPortalPlanController',
      controllerAs: 'apiPortalPlanCtrl',
      resolve: {
        resolvedPlans: function ($stateParams, ApiService) {
          return ApiService.listPlans($stateParams.apiId);
        }
      },
      data: {
        menu: {
          label: 'Plans',
          icon: 'view_week'
        }
      }
    })
    .state('apis.admin', {
      abstract: true,
      url: '/:apiId/settings',
      templateUrl: 'app/api/admin/apiAdmin.html',
      controller: 'ApiAdminController',
      controllerAs: 'apiCtrl',
      resolve: {
        resolvedApiState: function ($stateParams, ApiService) {
          return ApiService.isAPISynchronized($stateParams.apiId);
        },
        resolvedApi: function ($stateParams, ApiService) {
          return ApiService.get($stateParams.apiId);
        }
      }
    })
    .state('apis.admin.general', {
      templateUrl: 'app/api/admin/general/api.html',
      controller: 'ApiGeneralController',
      controllerAs: 'generalCtrl',
      data: {
        menu: {
          label: 'Global settings',
          icon: 'blur_on'
        }
      }
    })
    .state('apis.admin.general.main', {
      url: '/general',
      templateUrl: 'app/api/admin/general/apiGeneral.html',
      controller: 'ApiGeneralController',
      controllerAs: 'generalCtrl',
      data: {menu: null}
    })
    .state('apis.admin.general.gateway', {
      url: '/gateway',
      templateUrl: 'app/api/admin/general/apiGateway.html',
      controller: 'ApiGeneralController',
      controllerAs: 'generalCtrl',
      data: {menu: null}
    })
    .state('apis.admin.general.endpoint', {
      url: '/endpoint/:endpointName',
      templateUrl: 'app/api/admin/endpoint/endpointConfiguration.html',
      controller: 'ApiEndpointController',
      controllerAs: 'endpointCtrl',
      data: {menu: null}
    })
    .state('apis.admin.plans', {
      url: '/plans?state',
      templateUrl: 'app/api/admin/plans/apiPlans.html',
      controller: 'ApiPlansController',
      controllerAs: 'apiPlansCtrl',
      resolve: {
        resolvedPlans: function ($stateParams, ApiService) {
          return ApiService.getApiPlans($stateParams.apiId);
        }
      },
      data: {
        menu: {
          label: 'Plans',
          icon: 'view_week'
        }
      }
    })
    .state('apis.admin.subscriptions', {
      url: '/subscriptions',
      templateUrl: 'app/api/admin/subscriptions/subscriptions.html',
      controller: 'SubscriptionsController',
      controllerAs: 'subscriptionsCtrl',
      resolve: {
        resolvedSubscriptions: function ($stateParams, ApiService) {
          return ApiService.getSubscriptions($stateParams.apiId);
        }
      },
      data: {
        menu: {
          label: 'Subscriptions',
          icon: 'vpn_key'
        }
      }
    })
    .state('apis.admin.resources', {
      url: '/resources',
      templateUrl: 'app/api/admin/resources/resources.html',
      controller: 'ApiResourcesController',
      controllerAs: 'apiResourcesCtrl',
      data: {
        menu: {
          label: 'Resources',
          icon: 'style'
        }
      }
    })
    .state('apis.admin.policies', {
      url: '/policies',
      templateUrl: 'app/api/admin/policies/apiPolicies.html',
      controller: 'ApiPoliciesController',
      controllerAs: 'apiPoliciesCtrl',
      data: {
        menu: {
          label: 'Policies',
          icon: 'share'
        }
      }
    })
    .state('apis.admin.documentation', {
      url: '/documentation',
      templateUrl: 'app/api/admin/documentation/apiDocumentation.html',
      controller: 'DocumentationController',
      controllerAs: 'documentationCtrl',
      data: {
        menu: {
          label: 'Documentation',
          icon: 'insert_drive_file'
        }
      }
    })
    .state('apis.admin.members', {
      url: '/members',
      templateUrl: 'app/api/admin/members/members.html',
      controller: 'ApiMembersController',
      controllerAs: 'apiMembersCtrl',
      resolve: {
        resolvedMembers: function ($stateParams, ApiService) {
          return ApiService.getMembers($stateParams.apiId);
        }
      },
      data: {
        menu: {
          label: 'Members',
          icon: 'group'
        }
      }
    })
    .state('apis.admin.properties', {
      url: '/properties',
      templateUrl: 'app/api/admin/properties/properties.html',
      controller: 'ApiPropertiesController',
      controllerAs: 'apiPropertiesCtrl',
      data: {
        menu: {
          label: 'Properties',
          icon: 'assignment'
        }
      }
    })
    .state('apis.admin.analytics', {
      url: '/analytics?from&to',
      templateUrl: 'app/api/admin/analytics/analytics.html',
      controller: 'ApiAnalyticsController',
      controllerAs: 'analyticsCtrl',
      data: {
        menu: {
          label: 'Analytics',
          icon: 'insert_chart'
        }
      }
    })
    .state('apis.admin.documentation.new', {
      url: '/new?type',
      templateUrl: 'app/api/admin/documentation/page/apiPage.html',
      controller: 'PageController',
      controllerAs: 'pageCtrl',
      data: {menu: null}
    })
    .state('apis.admin.documentation.page', {
      url: '/:pageId',
      templateUrl: 'app/api/admin/documentation/page/apiPage.html',
      controller: 'PageController',
      controllerAs: 'pageCtrl',
      data: {menu: null}
    })
    .state('apis.admin.healthcheck', {
      url: '/healthcheck',
      templateUrl: 'app/api/admin/healthcheck/healthcheck.html',
      controller: 'ApiHealthCheckController',
      controllerAs: 'healthCheckCtrl',
      data: {
        menu: {
          label: 'Health-check',
          icon: 'favorite'
        }
      }
    })
    .state('apis.admin.history', {
      url: '/history',
      templateUrl: 'app/api/admin/history/apiHistory.html',
      controller: 'ApiHistoryController',
      controllerAs: 'apiHistoryCtrl',
      resolve: {
        resolvedEvents: function ($stateParams, ApiService) {
          var eventTypes = "PUBLISH_API";
          return ApiService.getApiEvents($stateParams.apiId, eventTypes);
        }
      },
      data: {
        menu: {
          label: 'History',
          icon: 'history'
        }
      }
    })
    .state('apis.admin.events', {
      url: '/events',
      templateUrl: 'app/api/admin/events/apiEvents.html',
      controller: 'ApiEventsController',
      controllerAs: 'apiEventsCtrl',
      resolve: {
        resolvedEvents: function ($stateParams, ApiService) {
          var eventTypes = "START_API,STOP_API";
          return ApiService.getApiEvents($stateParams.apiId, eventTypes);
        }
      },
      data: {
        menu: {
          label: 'Events',
          icon: 'event_note'
        }
      }
    })
    .state('applications', {
      url: '/applications',
      templateUrl: 'app/application/applications.html',
      abstract: true,
      parent: 'root'
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
    .state('instances', {
      abstract: true,
      url: '/instances',
      templateUrl: 'app/instances/instancesList.html',
      parent: 'root'
    })
    .state('instances.list', {
      url: '/',
      templateUrl: 'app/instances/instances.html',
      controller: 'InstancesController',
      controllerAs: 'instancesCtrl',
      resolve: {
        resolvedInstances: (InstancesService: InstancesService) => InstancesService.list()
      },
      data: {
        menu: {
          label: 'Instances',
          icon: 'developer_dashboard',
          firstLevel: true,
          order: 30
        },
        roles: ['ADMIN']
      }
    })
    .state('instances.detail', {
      abstract: true,
      url: '/:id',
      templateUrl: 'app/instances/details/instance.html',
      controller: 'InstanceController',
      controllerAs: 'instanceCtrl',
      resolve: {
        resolvedInstance: function ($stateParams, InstancesService) {
          return InstancesService.get($stateParams.id);
        }
      }
    })
    .state('instances.detail.environment', {
      url: '/environment',
      templateUrl: 'app/instances/details/environment/instanceEnvironment.html',
      controller: 'InstanceEnvironmentController',
      controllerAs: 'instanceEnvironmentCtrl',
      data: {
        menu: {
          label: 'Environment',
          icon: 'computer'
        }
      }
    })
    .state('instances.detail.monitoring', {
      url: '/monitoring',
      templateUrl: 'app/instances/details/monitoring/instanceMonitoring.html',
      controller: 'InstanceMonitoringController',
      controllerAs: 'instanceMonitoringCtrl',
      data: {
        menu: {
          label: 'Monitoring',
          icon: 'graphic_eq'
        },
      },
      resolve: {
        resolvedMonitoringData: function ($stateParams, InstancesService, resolvedInstance) {
          return InstancesService.getMonitoringData($stateParams.id, resolvedInstance.data.id);
        }
      }
    })
    .state('platform', {
      url: '/platform?from&to',
      templateUrl: 'app/platform/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dashboardCtrl',
      data: {
        menu: {
          label: 'Dashboard',
          icon: 'show_chart',
          firstLevel: true,
          order: 40
        },
        roles: ['ADMIN']
      },
      parent: 'root'
    })
    .state('configuration', {
      abstract: true,
      template: '<div ui-view></div>',
      url: '/configuration',
      parent: 'root'
    })
    .state('configuration.admin', {
      url: '/admin',
      controller: function ($state, $rootScope) {
        $rootScope.currentResource = 'CONFIGURATION';
        if ('configuration.admin' === $state.current.name) {
          $state.go('configuration.admin.views');
        }
      },
      template: '<div ui-view></div>',
      data: {
        menu: {
          label: 'Configuration',
          icon: 'settings',
          firstLevel: true,
          order: 50
        },
        roles: ['ADMIN']
      }
    })
    .state('configuration.admin.views', {
      url: '/views',
      component: 'views',
      /*templateUrl: 'app/configuration/admin/views/views.html',
      controller: 'ViewsController',
      controllerAs: 'viewsCtrl',*/
      resolve: {
        views: (ViewService: ViewService) => ViewService.list().then(response => response.data)
      },
      data: {
        menu: {
          label: 'Views',
          icon: 'view_module'
        },
        roles: ['ADMIN']
      }
    })
    .state('configuration.admin.tags', {
      url: '/tags',
      templateUrl: 'app/configuration/admin/tags/tags.html',
      controller: 'TagsController',
      controllerAs: 'tagsCtrl',
      data: {
        menu: {
          label: 'Sharding tags',
          icon: 'label'
        },
        roles: ['ADMIN']
      }
    })
    .state('configuration.admin.tenants', {
      url: '/tenants',
      templateUrl: 'app/configuration/admin/tenants/tenants.html',
      controller: 'TenantsController',
      controllerAs: 'tenantsCtrl',
      data: {
        menu: {
          label: 'Tenants',
          icon: 'shuffle'
        },
        roles: ['ADMIN']
      }
    })
    .state('configuration.admin.groups', {
      url: '/groups',
      templateUrl: 'app/configuration/admin/groups/groups.html',
      controller: 'GroupsController',
      controllerAs: 'groupsCtrl',
      data: {
        menu: {
          label: 'Groups',
          icon: 'group_work'
        },
        roles: ['ADMIN']
      }
    })
    .state('user', {
      url: '/user',
      templateUrl: 'app/user/user.html',
      controller: 'UserController',
      controllerAs: 'userCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'loginCtrl',
      data: {
        devMode: true
      }
    })
    .state('registration', {
      url: '/registration',
      templateUrl: 'app/registration/registration.html',
      controller: 'RegistrationController',
      controllerAs: 'registrationCtrl',
      data: {
        devMode: true
      }
    })
    .state('confirm', {
      url: '/registration/confirm/:token',
      templateUrl: 'app/registration/confirm/confirm.html',
      controller: 'ConfirmController',
      controllerAs: 'confirmCtrl',
      data: {
        devMode: true
      }
    })
    .state('logout',{
      resolve: {
        doLogout: (UserService, $state: ng.ui.IStateService) => {
          return UserService.logout().then(
            () => $state.go('login', { reducedMode: true })
          );
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
