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

    const baseCustomFieldGroup_1 = await sails.helpers.baseCustomFieldGroups.createOne.with({
      values: {
        name: 'Item Info',
        project,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_1_1 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Budget',
        showOnFrontOfCard: false,
        position: 65536,
        baseCustomFieldGroup: baseCustomFieldGroup_1,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_1_2 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Start Date',
        showOnFrontOfCard: false,
        position: 131072,
        baseCustomFieldGroup: baseCustomFieldGroup_1,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_1_3 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Finish Date',
        showOnFrontOfCard: false,
        position: 196608,
        baseCustomFieldGroup: baseCustomFieldGroup_1,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_1_4 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Actual',
        showOnFrontOfCard: false,
        position: 262144,
        baseCustomFieldGroup: baseCustomFieldGroup_1,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const baseCustomFieldGroup_2 = await sails.helpers.baseCustomFieldGroups.createOne.with({
      values: {
        name: 'Planned Project Timeline',
        project,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_2_1 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Start Date',
        showOnFrontOfCard: false,
        position: 65536,
        baseCustomFieldGroup: baseCustomFieldGroup_2,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const customField_2_2 = await sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
      project,
      values: {
        name: 'Finish Date',
        showOnFrontOfCard: false,
        position: 131072,
        baseCustomFieldGroup: baseCustomFieldGroup_2,
      },
      actorUser: currentUser,
      request: this.req,
    });

    // Create a default board for the project
    let boardImport;
    const { board, boardMembership } = await sails.helpers.boards.createOne.with({
      values: {
        name: 'Project Info',
        position: 65536,
        project,
      },
      import: boardImport,
      actorUser: currentUser,
      requestId: inputs.requestId,
      request: this.req,
    });

    const list = await sails.helpers.lists.createOne.with({
      project,
      values: {
        name: 'Project Info',
        type: 'active',
        position: 65536,
        board,
      },
      actorUser: currentUser,
      request: this.req,
    });

    const card = await sails.helpers.cards.createOne
      .with({
        project,
        values: {
          name: 'Project Info',
          type: 'project',
          position: 65536,
          board,
          list,
          creatorUser: currentUser,
        },
        request: this.req,
      })
      .intercept('positionMustBeInValues', () => Errors.POSITION_MUST_BE_PRESENT);

    return {
      item: project,
      included: {
        projectManagers: [projectManager],
        initialBaseCustomFieldGroups: [baseCustomFieldGroup_1, baseCustomFieldGroup_2],
        initialCustomFields: [customField_1_1,
                              customField_1_2,
                              customField_1_3,
                              customField_1_4,
                              customField_2_1,
                              customField_2_2],
        initialBoards: [board],
        initialLists: [list],
        initialCards: [card],
      },
    };
  },
};
