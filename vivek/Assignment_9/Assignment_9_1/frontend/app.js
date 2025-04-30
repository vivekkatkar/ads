var app = angular.module('companyApp', []);

app.controller('CompanyController', function ($scope, $http) {
  const API_URL = 'http://localhost:3000/companies';

  $scope.getCompanies = function () {
    $http.get(API_URL).then(response => {
      $scope.companies = response.data;
    });
  };

  $scope.addCompany = function () {
    $http.post(API_URL, $scope.newCompany).then(response => {
      $scope.companies.push(response.data);
      $scope.newCompany = {};
    });
  };

  $scope.editCompany = function (company) {
    $scope.editing = true;
    $scope.editingCompany = angular.copy(company);
  };

  $scope.updateCompany = function () {
    $http.put(`${API_URL}/${$scope.editingCompany._id}`, $scope.editingCompany).then(response => {
      const index = $scope.companies.findIndex(c => c._id === response.data._id);
      $scope.companies[index] = response.data;
      $scope.editing = false;
    });
  };

 
  $scope.deleteCompany = function (id) {
    $http.delete(`${API_URL}/${id}`).then(() => {
      $scope.companies = $scope.companies.filter(c => c._id !== id);
    });
  };

  $scope.getCompanies();
});
