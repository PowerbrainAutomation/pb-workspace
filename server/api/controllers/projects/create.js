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

    const projectTemplate = require("./project-templates/base")

    const baseCustomFieldGroups = await Promise.all(
      projectTemplate.baseCustomFieldGroupDefs.map((def) =>
        sails.helpers.baseCustomFieldGroups.createOne.with({
          values: {
            name: def.name,
            project,
          },
          actorUser: currentUser,
          request: this.req,
        }),
      ),
    );

    const customFields = await Promise.all(
      projectTemplate.customFieldDefs.map((def) =>
        sails.helpers.customFields.createOneInBaseCustomFieldGroup.with({
          project,
          values: {
            name: def.name,
            showOnFrontOfCard: false,
            position: def.position,
            baseCustomFieldGroup: baseCustomFieldGroups.find(
              (group) => group.name === def.baseCustomFieldGroupName,
            ),
          },
          actorUser: currentUser,
          request: this.req,
        }),
      ),
    );

    const boardResult = await Promise.all(
      projectTemplate.boardDefs.map((def) =>
        sails.helpers.boards.createOne.with({
          values: {
            name: def.name,
            position: def.position,
            project,
          },
          import: undefined,
          actorUser: currentUser,
          requestId: inputs.requestId,
          request: this.req,
        }),
      ),
    );

    const boards = boardResult.map(r => r.board);
    const boardMemberships = boardResult.map(r => r.boardMembership);

    const lists = await Promise.all(
      projectTemplate.listDefs.map((def) =>
        sails.helpers.lists.createOne.with({
          project,
          values: {
            name: def.name,
            type: def.type,
            position: def.position,
            board: boards.find((board) => board.name === def.boardName),
          },
          actorUser: currentUser,
          request: this.req,
        }),
      ),
    );

    const cards = await Promise.all(
      projectTemplate.cardDefs.map((def) =>
        sails.helpers.cards.createOne
          .with({
            project,
            values: {
              name: def.name,
              type: def.type,
              position: def.position,
              board: boards.find((board) => board.name === def.boardName),
              list: lists.find((list) => list.name === def.listName),
              creatorUser: currentUser,
            },
            request: this.req,
          })
          .intercept('positionMustBeInValues', () => Errors.POSITION_MUST_BE_PRESENT),
      ),
    );

    const customFieldGroups = await Promise.all(
      projectTemplate.customFieldGroupsDefs.map((def) =>
        sails.helpers.customFieldGroups.createOneInCard
          .with({
            project,
            board: boards.find((board) => board.name === def.boardName),
            list: lists.find((list) => list.name === def.listName),
            values: {
              name: def.name,
              position: def.position,
              card: cards.find((card) => card.name === def.cardName),
              baseCustomFieldGroup: baseCustomFieldGroups.find(
                (group) => group.name === def.baseCustomFieldGroupName,
              ),
            },
            actorUser: currentUser,
            request: this.req,
          })
          .intercept(
            'baseCustomFieldGroupOrNameMustBeInValues',
            () => Errors.BASE_CUSTOM_FIELD_GROUP_OR_NAME_MUST_BE_PRESENT,
          ),
      ),
    );

    return {
      item: project,
      included: {
        projectManagers: [projectManager],
        initialBaseCustomFieldGroups: baseCustomFieldGroups,
        initialCustomFields: customFields,
        initialBoards: boards,
        initialBoardMemberships: boardMemberships,
        initialLists: lists,
        initialCards: cards,
        initialCustomFieldGroups: customFieldGroups,
      },
    };
  },
};
