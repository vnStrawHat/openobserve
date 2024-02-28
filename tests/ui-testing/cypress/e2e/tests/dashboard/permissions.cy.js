import { Permission, Entity, setupRolesAndPermissions, deleteRole, performRolePermissionsSetup, templateCreation, createAlert,generateRandomRoleName, createDestination, switchOrg, createFolder} from "../../allfunctions/permissions";
import {getRandomText } from "../../utils";

describe('Visit a specific link test', () => {
    let dashboardData;
    let dashboardName;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
   
    // Generate a random number
    const randomNumber = getRandomInt(1000, 9999)
    before(function () {
        cy.fixture("dashboard").then(function (data) {
            dashboardData = data;
        });
    });

    beforeEach(() => {
        cy.intercept("*", (req) => {
            delete req.headers["if-none-match"];
          });
      // Visit the link before each test case
      ;
  
      
      cy.loginwithadmin()
    //   cy.contains('Login with SSO').click({force:true})
    //    cy.get('[placeholder="email address"]').type('neha@o2.ai');
    //     cy.get('[placeholder="password"]').type('ComplexSuperman1');
    //     cy.get('#submit-login').click()
    //     // cy.wait(5000)
    //     cy.get('.q-field__append > .q-icon').click()
    //     cy.get('[data-test="menu-link-/iam-item"]').click()
    //     cy.intercept('GET', '**/api/default/roles/**').as('allroles');
    cy.intercept('GET', '**/api/test/roles/**').as('allroles')
    cy.intercept('GET', '**/api/test/folders/**').as('folders');

    
    });
  
    
    
  
    it('Roles:Display error on clicking Save button without entering name', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.get('[data-test="iam-roles-tab"]').click({force:true})
        cy.get('[data-test="alert-list-add-alert-btn"]').click({force:true})
        cy.wait(2000)
        cy.get('[data-test="add-role-rolename-input-btn"] > .q-field > .q-field__inner > .q-field__control').type('   ');

        cy.get('[data-test="add-alert-submit-btn"]').click({force:true})
        cy.contains('Name is required').should('be.visible')

    });

    it('Roles: Enter name and create role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.get('[data-test="iam-roles-tab"]').click({force:true})
        cy.get('[data-test="alert-list-add-alert-btn"]').click({force:true})
        const role = generateRandomRoleName(8);
        cy.wait(2000)
        cy.get('[data-test="add-role-rolename-input-btn"] > .q-field > .q-field__inner > .q-field__control').type(role);

        cy.get('[data-test="add-alert-submit-btn"]').click({force:true})
        // deleteRole(role)
      

    });

    it('Roles: give functions delete and create role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);
   
       setupRolesAndPermissions(role, [
            {
                item: Entity.FUNCTIONS,
                permissions: [Permission.CREATE, Permission.LIST, Permission.UPDATE, Permission.DELETE]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
        cy.get('[data-test="menu-link-/functions-item"]').click()
        cy.wait(3000)
        cy.contains('Create new function').click({force:true})
        cy.get('.q-pb-sm > .q-field > .q-field__inner > .q-field__control').type('testfunction')
        cy.contains('Save').click({force:true})
        cy.get('[title="Delete Function"]').click({force:true})
        cy.get('[data-test="confirm-button"]').click({ force: true }); 
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });


    it('Roles: give functions only list role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      

        const role = generateRandomRoleName(8);
        cy.wait(4000);

       setupRolesAndPermissions(role, [
            {
                item: Entity.FUNCTIONS,
                permissions: [Permission.LIST]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
        cy.get('[data-test="menu-link-/functions-item"]').click()
        cy.wait(3000)
        cy.contains('Create new function').click({force:true})
        cy.get('.q-pb-sm > .q-field > .q-field__inner > .q-field__control').type('testfunction')
        cy.contains('Save').click({force:true})
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });

    it('Roles: give functions only GET role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);
      

       setupRolesAndPermissions(role, [
            {
                item: Entity.FUNCTIONS,
                permissions: [Permission.GET]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
        cy.get('[data-test="menu-link-/functions-item"]').click()
        cy.wait(3000)
        cy.contains('Create new function').click({force:true})
        cy.get('.q-pb-sm > .q-field > .q-field__inner > .q-field__control').type('testfunction')
        cy.contains('Save').click({force:true})
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        deleteRole(role)
        
    });



    it('Roles: give functions only UPDATE role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);
     
       setupRolesAndPermissions(role, [
            {
                item: Entity.FUNCTIONS,
                permissions: [Permission.UPDATE]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/functions-item"]').click()
        cy.wait(3000)
        cy.contains('Create new function').click({force:true})
        cy.get('.q-pb-sm > .q-field > .q-field__inner > .q-field__control').type('testfunction')
        cy.contains('Save').click({force:true})
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        deleteRole(role)
        
    });


    it('Roles: give functions UPDATE, LIST, ALL role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      

        const role = generateRandomRoleName(8);
        cy.wait(4000);

       setupRolesAndPermissions(role, [
            {
                item: Entity.FUNCTIONS,
                permissions: [Permission.UPDATE, Permission.LIST,Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/functions-item"]').click()
        cy.wait(3000)
        cy.contains('Create new function').click({force:true})
        cy.get('.q-pb-sm > .q-field > .q-field__inner > .q-field__control').type('testfunction')
        cy.contains('Save').click({force:true})
        cy.get('[title="Delete Function"]:first').click({force:true})
        cy.get('[data-test="confirm-button"]').click({ force: true }); 
        cy.loginwithadmin()
        cy.wait(2000) 
        deleteRole(role)
        
    });



    it('Roles: give dashboard delete and create role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.CREATE, Permission.LIST, Permission.UPDATE, Permission.DELETE]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.CREATE, Permission.LIST, Permission.UPDATE, Permission.DELETE]
            },
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        cy.get('[data-test="dashboard-add"]').click({force:true})
        dashboardName = `${dashboardData.DashboardName}_${randomNumber}`
        cy.get('[data-test="add-dashboard-name"]').type(dashboardName)
        cy.get('[data-test="dashboard-add-submit"]').click({force:true})
        cy.wait(3000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click({force:true})
        cy.get('[data-test="dashboard-table"]')
        .find("td")
        .filter((index, element) =>
          Cypress.$(element).text().includes(dashboardData.DashboardName)
        )
        .each((item) => {
          console.log("==", item);
          // cy.wrap(item).contains(dashboardData.DashboardName).then(($el)=>{
          cy.wrap(item)
            .siblings()
            .wait(2000)
            .find('[data-test="dashboard-delete"]') // finds the delete button and clicks on it
            .click({ force: true });
          cy.get('[data-test="confirm-button"]').click();
          // })
        });
      
        
    });

    it('Roles: give dashboard list role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
     
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        cy.get('[data-test="dashboard-add"]').click({force:true})
        dashboardName = `${dashboardData.DashboardName}_${randomNumber}`
        cy.get('[data-test="add-dashboard-name"]').type(dashboardName)
        cy.get('[data-test="dashboard-add-submit"]').click({force:true})
        cy.wait(3000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click({force:true})
        cy.wait(300)
        cy.get('[data-test="dashboard-table"]')
        .find("td")
        .filter((index, element) =>
          Cypress.$(element).text().includes(dashboardData.DashboardName)
        )
        .each((item) => {
          console.log("==", item);
          // cy.wrap(item).contains(dashboardData.DashboardName).then(($el)=>{
          cy.wrap(item)
            .siblings()
            .wait(2000)
            .find('[data-test="dashboard-delete"]') // finds the delete button and clicks on it
            .click({ force: true });
          cy.get('[data-test="confirm-button"]').click();
          // })
        });
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)
      
        
    });


    it('Roles: give dashboard list,create role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);

       setupRolesAndPermissions(role, [
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST, Permission.CREATE]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        cy.get('[data-test="dashboard-add"]').click({force:true})
        dashboardName = `${dashboardData.DashboardName}_${randomNumber}`
        cy.get('[data-test="add-dashboard-name"]').type(dashboardName)
        cy.get('[data-test="dashboard-add-submit"]').click({force:true})
        cy.wait(3000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click({force:true})
        cy.wait(300)
        cy.get('[data-test="dashboard-table"]')
        .find("td")
        .filter((index, element) =>
          Cypress.$(element).text().includes(dashboardData.DashboardName)
        )
        .each((item) => {
          console.log("==", item);
          // cy.wrap(item).contains(dashboardData.DashboardName).then(($el)=>{
          cy.wrap(item)
            .siblings()
            .wait(2000)
            .find('[data-test="dashboard-delete"]') // finds the delete button and clicks on it
            .click({ force: true });
          cy.get('[data-test="confirm-button"]').click();
          // })
        });
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });

    it('Roles: give dashboard list,create , delete dashboard role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);



       setupRolesAndPermissions(role, [
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST, Permission.CREATE, Permission.DELETE]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        cy.get('[data-test="dashboard-add"]').click({force:true})
        dashboardName = `${dashboardData.DashboardName}_${randomNumber}`
        cy.get('[data-test="add-dashboard-name"]').type(dashboardName)
        cy.get('[data-test="dashboard-add-submit"]').click({force:true})
        cy.wait(3000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click({force:true})
        cy.wait(300)
        cy.get('[data-test="dashboard-table"]')
        .find("td")
        .filter((index, element) =>
          Cypress.$(element).text().includes(dashboardData.DashboardName)
        )
        .each((item) => {
          console.log("==", item);
          // cy.wrap(item).contains(dashboardData.DashboardName).then(($el)=>{
          cy.wrap(item)
            .siblings()
            .wait(2000)
            .find('[data-test="dashboard-delete"]') // finds the delete button and clicks on it
            .click({ force: true });
          cy.get('[data-test="confirm-button"]').click();
          // })
        });
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });


    it('Roles: give dashboard list,create, update dashboard', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST, Permission.CREATE, Permission.UPDATE]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
      
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        cy.get('[data-test="dashboard-add"]').click({force:true})
        dashboardName = `${dashboardData.DashboardName}_${randomNumber}`
        cy.get('[data-test="add-dashboard-name"]').type(dashboardName)
        cy.get('[data-test="dashboard-add-submit"]').click({force:true})
        cy.wait(3000)
        cy.get('[data-test="menu-link-/dashboards-item"]').click({force:true})
        cy.wait(300)
        cy.get('[data-test="dashboard-table"]')
        .find("td")
        .filter((index, element) =>
          Cypress.$(element).text().includes(dashboardData.DashboardName)
        )
        .each((item) => {
          console.log("==", item);
          // cy.wrap(item).contains(dashboardData.DashboardName).then(($el)=>{
          cy.wrap(item)
            .siblings()
            .wait(2000)
            .find('[data-test="dashboard-delete"]') // finds the delete button and clicks on it
            .click({ force: true });
          cy.get('[data-test="confirm-button"]').click();
          // })
        });
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });


    it('Roles: give streams list and update streams permissions', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);



       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST, Permission.UPDATE]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
    
        cy.get('[data-test="menu-link-/streams-item"]').click({force:true})
        cy.get('[title="Stream Detail"]').click({force:true})
        cy.get('tbody > :nth-child(2) > :nth-child(4)').click({force:true})
        cy.get('[data-test="schema-update-settings-button"]').click({force:true})
        cy.wait(3000)
        cy.loginwithadmin()
        deleteRole(role)   
        
    });

    // TODO: this testcase is failing run and check once bug fixed
    it('Roles: give only list streams permissions', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');

        const role = generateRandomRoleName(8);
        cy.wait(4000);

       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
        cy.get('[data-test="menu-link-/streams-item"]').click({force:true})
        cy.wait(200)
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        // cy.get('[title="Stream Detail"]').click({force:true})
        // cy.wait(2000)
        // cy.get('[data-test="schema-stream-job-field-bloom-key-checkbox"] > .q-checkbox__inner').click({force:true})
        // cy.get('[data-test="schema-update-settings-button"]').click({force:true})
        // cy.wait(300)
        // cy.get('.q-notification__message').contains('Stream settings updated').should('exist')
        // cy.wait(3000)
        cy.loginwithadmin()
        deleteRole(role)   
        
    });

    it('Roles: delete stream without permission', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
      
        cy.get('[data-test="menu-link-/streams-item"]').click({force:true})
        cy.get('[title="Delete"]').click({force:true})
        cy.get('.q-card__actions > .bg-primary').click({force:true})
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        
        //  data-test="schema-stream-job-field-bloom-key-checkbox"] > .q-checkbox__inner').click({force:true})
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });


    it('Roles: delete stream with GET permission', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.GET]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
      
        cy.get('[data-test="menu-link-/streams-item"]').click({force:true})
        cy.get('[title="Delete"]:first').click({force:true})
        cy.get('.q-card__actions > .bg-primary').click({force:true})
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        
        //  data-test="schema-stream-job-field-bloom-key-checkbox"] > .q-checkbox__inner').click({force:true})
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });

    it.skip('Roles: delete stream with GET,ALL permission', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);

       

       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.GET,  Permission.ALL]
            },
            {
                item: Entity.ROLES,
                permissions: [Permission.ALL]
            },
           
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
        cy.wait(2000)
    
        cy.get('[data-test="menu-link-/streams-item"]').click({force:true})
        cy.get('[title="Delete"]:first').click({force:true})
        cy.get('.q-card__actions > .bg-primary').click({force:true})
        // cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('not.exist')
        
        //  data-test="schema-stream-job-field-bloom-key-checkbox"] > .q-checkbox__inner').click({force:true})
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });


    it('Roles: give alerts  UPDATE, LIST, ALL role, user to get 403 for template creation', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);
      


       setupRolesAndPermissions(role, [
            {
                item: Entity.ALERTS,
                permissions: [Permission.UPDATE, Permission.LIST,Permission.ALL]
            },
            
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
      
        templateCreation()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });

    it('Roles: give template UPDATE, LIST, ALL role', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      


        const role = generateRandomRoleName(8);
        cy.wait(4000);
       setupRolesAndPermissions(role, [
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.UPDATE, Permission.LIST,Permission.ALL]
            },
            
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
     
        templateCreation()
        cy.get(".q-notification__message")
        .contains("Template Saved Successfully")
        .should("be.visible");
        cy.get('tbody [data-test$="-delete-template"]').each(($button) => {
            cy.wrap($button).click();
            cy.get('[data-test="confirm-button"]').click({ force: true });
          });
      
      
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });
    

    it('Roles: give template  LIST', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.LIST]
            },
            
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
     
        templateCreation()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });
    
    it('Roles: give template  GET', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      

        const role = generateRandomRoleName(8);
        cy.wait(4000);

       setupRolesAndPermissions(role, [
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.GET]
            },
            
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
        cy.get('.q-mx-sm > .q-field > .q-field__inner > .q-field__control > .q-field__control-container > .q-field__native > span').click({force:true})
        cy.wait(2000)
        cy.contains('default').click({force:true})
        cy.wait(2000)
        templateCreation()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });

    it('Roles: give template  GET', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      
        const role = generateRandomRoleName(8);
        cy.wait(4000);
    
       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.ALL]
            },
            {
                item: Entity.ALERTS,
                permissions: [Permission.ALL]
            },
            {
                item: Entity.DESTINATIONS,
                permissions: [Permission.ALL]
            }
            
        ])
        cy.wait(3000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(200)
        cy.loginwithuser()
        switchOrg()
       cy.wait(4000)
        cy.get('[data-test="menu-link-/alerts-item"]').click()
        cy.wait(2000)
        createAlert()
        cy.loginwithadmin()
        // cy.wait(2000) 
        // deleteRole(role)
        
    });

    it('Roles: give Destination LIST', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      
        const role = generateRandomRoleName(8);
        cy.wait(4000);
    
       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.ALL]
            },
            {
                item: Entity.DESTINATIONS,
                permissions: [Permission.LIST]
            }
            
        ])
        cy.wait(3000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(200)
        cy.loginwithuser()
        switchOrg()
       cy.wait(4000)
        cy.get('[data-test="menu-link-/alerts-item"]').click()
        cy.wait(2000)
        createDestination()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.get('[data-test="alert-templates-tab"]').click()
        cy.get('[data-test="alert-template-list-automationalert-delete-template"]').click()
        cy.get('[data-test="confirm-button"] > .q-btn__content').click()
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });

    it('Roles: give Destination GET', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      
        const role = generateRandomRoleName(8);
        cy.wait(4000);
    
       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.ALL]
            },
            {
                item: Entity.DESTINATIONS,
                permissions: [Permission.GET]
            }
            
        ])
        cy.wait(3000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(200)
        cy.loginwithuser()
        switchOrg()
       cy.wait(4000)
        cy.get('[data-test="menu-link-/alerts-item"]').click()
        cy.wait(2000)
        createDestination()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.get('[data-test="alert-templates-tab"]').click()
        cy.get('[data-test="alert-template-list-automationalert-delete-template"]').click()
        cy.get('[data-test="confirm-button"] > .q-btn__content').click()
        cy.loginwithadmin()
        cy.wait(2000) 
        // deleteRole(role)
        
    });
    
    it('Roles: give Destination GET', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
      
        const role = generateRandomRoleName(8);
        cy.wait(4000);
    
       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.TEMPLATES,
                permissions: [Permission.ALL]
            },
            {
                item: Entity.DESTINATIONS,
                permissions: [Permission.UPDATE]
            }
            
        ])
        cy.wait(3000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(200)
        cy.loginwithuser()
        switchOrg()
       cy.wait(4000)
        cy.get('[data-test="menu-link-/alerts-item"]').click()
        cy.wait(2000)
        createDestination()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('be.visible')
        cy.get('[data-test="alert-templates-tab"]').click()
        cy.get('[data-test="alert-template-list-automationalert-delete-template"]').click()
        cy.get('[data-test="confirm-button"] > .q-btn__content').click()
        cy.loginwithadmin()
        cy.wait(2000)    
        
    });


    it('Roles: give dashboard list,create, update dashboard', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST]
            }     
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
      
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        createFolder()
        cy.get('.q-notifications__list--top.items-center >>>> .q-notification__message').contains('Unauthorized Access').should('exist')
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });

    it('Roles: give dashboard list,create, update dashboard', () => {
        cy.get('[data-test="menu-link-/iam-item"]').click()
        cy.intercept('GET', '**/api/default/roles/**').as('allroles');
        const role = generateRandomRoleName(8);
        cy.wait(4000);


       setupRolesAndPermissions(role, [
            {
                item: Entity.STREAMS,
                permissions: [Permission.LIST]
            },
            {
                item: Entity.DASHBOARD_FOLDERS,
                permissions: [Permission.LIST, Permission.CREATE, Permission.UPDATE, Permission.DELETE]
            }     
        ])
        cy.wait(2000)
        cy.get('[data-test="edit-role-save-btn"]').click()
        cy.wait(2000)
        cy.loginwithuser()
        switchOrg()
       cy.wait(2000)
      
        cy.get('[data-test="menu-link-/dashboards-item"]').click()
       
        cy.wait(3000)
        createFolder()
        // cy.wait("@folders");
        cy.get('[data-test="dashboard-delete-folder-icon"]').each(($deleteIcon) => {
        // Get the parent div and click the delete icon
        cy.wrap($deleteIcon).parents('.q-tab').find('[data-test="dashboard-delete-folder-icon"]').click({ force: true });
        cy.get('[data-test="confirm-button"]').click({ force: true });
    });
        cy.wait(3000)
        cy.loginwithadmin()
        // deleteRole(role)   
        
    });

    
    

  });