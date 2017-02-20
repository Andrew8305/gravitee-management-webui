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
import * as moment from 'moment';
import internal = require("stream");

class TimeframeDirective {
  constructor() {

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/analytics/timeframe.html',
      controller: TimeframeController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }
}

interface Timeframe {
  id: string,
  title: string,
  range: number,
  interval: number
}

class TimeframeController {
  private now: Date;
  private timeframes: Timeframe[];
  private timeframe: Timeframe;
  private pickerStartDate: Date;
  private pickerEndDate: Date;
  private current: any;

  constructor(
    private $scope: ng.IScope,
    private $rootScope,
    private $state: ng.ui.IStateService,
    private $timeout: ng.ITimeoutService) {
    'ngInject';

    this.now = moment().toDate();

    let that = this;
    $scope.$on('timeframeReload', function () {
      let updated = false;
      if ($state.params['from'] && $state.params['to']) {
        updated = true;
        that.update({
          from: $state.params['from'],
          to: $state.params['to']
        });
      }

      that.setTimeframe($state.params['timeframe'] || '1d', ! updated);
    });

    this.timeframes = [
      {
        id: '5m',
        title: 'Last 5m',
        range: 1000 * 60 * 5,
        interval: 1000 * 10
      }, {
        id: '30m',
        title: ' 30m',
        range: 1000 * 60 * 30,
        interval: 1000 * 15
      }, {
        id: '1h',
        title: ' 1h',
        range: 1000 * 60 * 60,
        interval: 1000 * 30
      }, {
        id: '3h',
        title: ' 3h',
        range: 1000 * 60 * 60 * 3,
        interval: 1000 * 60
      }, {
        id: '6h',
        title: ' 6h',
        range: 1000 * 60 * 60 * 6,
        interval: 1000 * 60 * 2
      }, {
        id: '12h',
        title: ' 12h',
        range: 1000 * 60 * 60 * 12,
        interval: 1000 * 60 * 5
      }, {
        id: '1d',
        title: '1d',
        range: 1000 * 60 * 60 * 24,
        interval: 1000 * 60 * 10
      }, {
        id: '3d',
        title: '3d',
        range: 1000 * 60 * 60 * 24 * 3,
        interval: 1000 * 60 * 30
      }, {
        id: '7d',
        title: '7d',
        range: 1000 * 60 * 60 * 24 * 7,
        interval: 1000 * 60 * 60
      }, {
        id: '14d',
        title: '14d',
        range: 1000 * 60 * 60 * 24 * 14,
        interval: 1000 * 60 * 60 * 3
      }, {
        id: '30d',
        title: '30d',
        range: 1000 * 60 * 60 * 24 * 30,
        interval: 1000 * 60 * 60 * 6
      }, {
        id: '90d',
        title: '90d',
        range: 1000 * 60 * 60 * 24 * 90,
        interval: 1000 * 60 * 60 * 12
      }
    ];

    // Event received when a zoom is done on a chart
    this.$rootScope.$on('timeframeZoom', function (event, zoom) {
      let diff = zoom.to - zoom.from;

      let timeframe = _.findLast(that.timeframes, function (timeframe: Timeframe) {
        return timeframe.range < diff;
      });

      if (!timeframe) {
        timeframe = that.timeframes[0];
      }

      this.update({
        interval: timeframe.interval,
        from: zoom.from,
        to: zoom.to
      });
    });

    this.$rootScope.$on('queryUpdated', function (event, query) {
      //TODO: what's the purpose of this ?
      console.log(query);
    });
  }

  updateTimeframe(timeframeId) {
    if (timeframeId) {
      this.$state.transitionTo(
        this.$state.current,
        _.merge(this.$state.params, {
          timestamp: '',
          timeframe: timeframeId
        }),
        {notify: false});
      this.setTimeframe(timeframeId, true);
    }
  }

  setTimestamp(timestamp) {
    var momentDate = moment.unix(timestamp);

    var startDate = Math.floor(momentDate.startOf('day').valueOf() / 1000);
    var endDate = Math.floor(momentDate.endOf('day').valueOf() / 1000);

    this.update({
      interval: 1000 * 60 * 5,
      from: startDate * 1000,
      to: endDate * 1000
    });
  }

  setTimeframe(timeframeId, update) {
    var that = this;

    this.timeframe = _.find(this.timeframes, function (timeframe: Timeframe) {
      return timeframe.id === timeframeId;
    });

    if (update) {
      var now = Date.now();

      this.update({
        interval: that.timeframe.interval,
        from: now - that.timeframe.range,
        to: now
      });
    }
  }

  update(timeframeParam) {
    let that = this;

    let timeframe = {
      interval: parseInt(timeframeParam.interval),
      from: parseInt(timeframeParam.from),
      to: parseInt(timeframeParam.to)
    };

    let diff = timeframe.to - timeframe.from;

    let tf = _.findLast(that.timeframes, function (tframe: Timeframe) {
      return tframe.range < diff;
    });

    if (!tf) {
      tf = that.timeframes[0];
    }

    // timeframeChange event is dynamically initialized, so we have to define a timeout to correctly fired it
    this.$timeout(function () {
      that.$scope.$broadcast('timeframeChange', {
        interval: tf.interval,
        from: timeframe.from,
        to: timeframe.to
      });
      that.$scope.$emit('timeframeChange', {
        interval: tf.interval,
        from: timeframe.from,
        to: timeframe.to
      });
    }, 200);

    this.current = {
      interval: tf.interval,
      intervalLabel: moment.duration(tf.interval).humanize(),
      from: timeframe.from,
      to: timeframe.to
    };

    // TODO: by using transitionTo, the view is reloaded and requests are done twice
    // TODO: must be fixed
    this.$state.transitionTo(
      this.$state.current,
      _.merge(this.$state.params, {
      // TODO: check if timeframe is required
      //  timeframe: tf.timeframe,
        interval: timeframe.interval,
        from: timeframe.from,
        to: timeframe.to
      }),
      {notify: false, reload: false});

    this.pickerStartDate = moment(timeframe.from).toDate();
    this.pickerEndDate = moment(timeframe.to).toDate();
  }

  updateRangeDate() {
    let from =  moment(this.pickerStartDate).startOf('day').unix() * 1000;
    let to = moment(this.pickerEndDate).endOf('day').unix() * 1000;

    let diff = to - from;

    let timeframe = _.findLast(this.timeframes, function (timeframe: Timeframe) {
      return timeframe.range < diff;
    });

    if (!timeframe) {
      timeframe = this.timeframes[0];
    }

    this.update({
      interval: timeframe.interval,
      from: from,
      to: to
    });
  }
}

export default TimeframeDirective;
