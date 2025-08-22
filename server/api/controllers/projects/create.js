/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    type: {
      type: 'string',
      isIn: Object.values(Project.Types),
      required: true,
    },
    name: {
      type: 'string',
      maxLength: 128,
      required: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      maxLength: 1024,
      allowNull: true,
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const values = _.pick(inputs, ['type', 'name', 'description']);

    const { project, projectManager } = await sails.helpers.projects.createOne.with({
      values,
      actorUser: currentUser,
      request: this.req,
    });

    const baseCustomFieldGroup = await sails.helpers.baseCustomFieldGroups.createOne.with({
      values: {
        name: 'Item Info',
        project,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_1 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Budget',
        showOnFrontOfCard: false,
        position: 65536,
        baseCustomFieldGroup,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_2 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Start Date',
        showOnFrontOfCard: false,
        position: 131072,
        baseCustomFieldGroup,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_3 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Finish Date',
        showOnFrontOfCard: false,
        position: 196608,
        baseCustomFieldGroup,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_4 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Actual',
        showOnFrontOfCard: false,
        position: 262144,
        baseCustomFieldGroup,
      },
      actorUser: currentUser,
      request: this.req,
    });

    return {
      item: project,
      included: {
        projectManagers: [projectManager],
        initialBaseCustomFieldGroups: [baseCustomFieldGroup],
        initialCustomFields: [customField_1, customField_2, customField_3, customField_4],
      },
    };
  },
};
