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
import * as _ from 'lodash';

class WidgetChartTableDirective {
  constructor() {
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/widget/widget-table.html',
      scope: {
        data: '=data'
      },
      controller: WidgetChartTableController,
      controllerAs: 'widgetChartTableCtrl',
      link: function($scope) {
        $scope.$watch('data', function(data) {
          if (data) {
            $scope.paging = 1;
            $scope.results = _.map(data.values, function (value, key) {
              return {
                key: key,
                value: value,
                metadata: (data && data.metadata) ? data.metadata[key] : undefined
              };
            });
          }
        }, true);
      }
    };

    return directive;
  }
}

class WidgetChartTableController {

  private selected: any[];
  private widget: any;

  constructor(
    private $scope: ng.IScope) {
    'ngInject';
  }

  selectItem(item) {
    this.updateQuery(item, true);
  };

  deselectItem(item) {
    this.updateQuery(item, false);
  };

  updateQuery(item, add) {
    var that = this;
    this.$scope.$emit('filterItemChange', {
      widget: (that.$scope.$parent.$parent.$parent.$parent as any).widget.$uid,
      field: (that.$scope.$parent as any).chart.request.field,
      key: item.key,
      name: item.metadata.name,
      mode: (add) ? 'add' : 'remove'
    });
  };
}

export default WidgetChartTableDirective;
