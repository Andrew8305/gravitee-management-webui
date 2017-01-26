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

interface IMember {
  username: string;
  type: string;
}

class ApplicationService {
  private baseURL: string;
  private applicationsURL: string;

  constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
		this.baseURL = '/management';
    this.applicationsURL = `${this.baseURL}applications/`;
  }

  private subscriptionsURL(applicationId: string): string {
    return `${this.applicationsURL}${applicationId}/subscriptions/`;
  }

	get(applicationId: string) {
    return this.$http.get(this.applicationsURL + applicationId);
  }

	getMembers(applicationId) {
		return this.$http.get(this.applicationsURL + applicationId + '/members');
	}

	addOrUpdateMember(applicationId: string, member: IMember): ng.IHttpPromise<any> {
    const url = `${this.applicationsURL}${applicationId}/members?user=${member.username}&type=${member.type}`;
    return this.$http.post(url, '');
	}

	deleteMember(applicationId, memberUsername) {
		return this.$http.delete(this.applicationsURL + applicationId + '/members?user=' + memberUsername);
	}

  list() {
    return this.$http.get(this.applicationsURL);
  }

  listByGroup(group) {
    return this.$http.get(this.applicationsURL + "?group=" + group);
  }

	create(application) {
    return this.$http.post(this.applicationsURL, application);
  }

  update(application) {
    return this.$http.put(
      this.applicationsURL + application.id,
      {
        'name': application.name,
        'description': application.description,
        'type': application.type,
        'group': application.group ? application.group.id : ''
      }
    );
  }

  delete(application): ng.IHttpPromise<any> {
    return this.$http.delete(this.applicationsURL + application.id);
  }

  search(query) {
    return this.$http.get(this.applicationsURL + "?query=" + query);
  }

  // Plans

  subscribe(applicationId, planId): ng.IHttpPromise<any> {
    return this.$http.post(this.subscriptionsURL(applicationId) + '?plan=' + planId, '');
  }

  listSubscriptions(applicationId, planId) {
    var url = this.subscriptionsURL(applicationId);
    if (planId) {
      url = url + '?plan=' + planId;
    }
    return this.$http.get(url);
  }

  getSubscription(applicationId, subscriptionId) {
    return this.$http.get(this.subscriptionsURL(applicationId) + subscriptionId);
  }

  listApiKeys(applicationId, subscriptionId) {
    return this.$http.get(this.subscriptionsURL(applicationId) + subscriptionId + '/keys');
  }

  renewApiKey(applicationId, subscriptionId) {
    return this.$http.post(this.subscriptionsURL(applicationId) + subscriptionId);
  }

  revokeApiKey(applicationId, subscriptionId, apiKey) {
    return this.$http.delete(this.subscriptionsURL(applicationId) + subscriptionId + '/keys/' + apiKey);
  }

  /*
   * Analytics
   */
  analytics(application, request) {
    var url = this.applicationsURL + application + '/analytics?';

    var keys = Object.keys(request);
    _.forEach(keys, function (key) {
      var val = request[key];
      if (val !== undefined && val !== '') {
        url += key + '=' + val + '&';
      }
    });

    return this.$http.get(url);
  }
}

export default ApplicationService;