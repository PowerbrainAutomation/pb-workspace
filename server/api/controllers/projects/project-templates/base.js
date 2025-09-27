/*!
 * Modified by Powerbrain
 */

module.exports = {
  baseCustomFieldGroupDefs: [
      { name: 'Item Info' },
      { name: 'Planned Project Timeline' },
    ],
  customFieldDefs: [
      { name: 'Budget', position: 65536, baseCustomFieldGroupName: 'Item Info' },
      { name: 'Start Date', position: 131072, baseCustomFieldGroupName: 'Item Info' },
      { name: 'Finish Date', position: 196608, baseCustomFieldGroupName: 'Item Info' },
      { name: 'Actual', position: 262144, baseCustomFieldGroupName: 'Item Info' },
      { name: 'Start Date', position: 65536, baseCustomFieldGroupName: 'Planned Project Timeline' },
      { name: 'Finish Date', position: 131072, baseCustomFieldGroupName: 'Planned Project Timeline' },
    ],
  boardDefs: [
      { name: 'Project Info', position: 65536 },
    ],
  listDefs: [
      { name: 'Project Info', type: 'active', position: 65536, boardName: 'Project Info' },
    ],
  cardDefs: [
      { name: 'Project Info', type: 'project', position: 65536, boardName: 'Project Info', listName: 'Project Info' },
    ],
  customFieldGroupsDefs: [
      { name: null, position: 65536, boardName: 'Project Info', listName:'Project Info', cardName:'Project Info', baseCustomFieldGroupName: 'Planned Project Timeline' },
    ]
}
