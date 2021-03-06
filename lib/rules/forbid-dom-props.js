/**
 * @fileoverview Forbid certain props on DOM Nodes
 * @author David Vázquez
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = [];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid certain props on DOM Nodes',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        forbid: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          },
          uniqueItems: true
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    function isForbidden(prop) {
      const configuration = context.options[0] || {};

      const forbid = configuration.forbid || DEFAULTS;
      return forbid.indexOf(prop) >= 0;
    }

    return {
      JSXAttribute: function(node) {
        const tag = node.parent.name.name;
        if (!(tag && tag[0] !== tag[0].toUpperCase())) {
          // This is a Component, not  a DOM node, so exit.
          return;
        }

        const prop = node.name.name;

        if (!isForbidden(prop)) {
          return;
        }

        context.report({
          node: node,
          message: `Prop \`${prop}\` is forbidden on DOM Nodes`
        });
      }
    };
  }
};
