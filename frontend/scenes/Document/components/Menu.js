// @flow
import React, { Component } from 'react';
import invariant from 'invariant';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Document from 'models/Document';
import Icon from 'components/Icon';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';

type Props = {
  history: Object,
  document: Document,
};

@observer class Menu extends Component {
  props: Props;

  onCreateDocument = () => {
    this.props.history.push(`${this.props.document.collection.url}/new`);
  };

  onCreateChild = () => {
    invariant(this.props.document, 'Document is not available');
    this.props.history.push(`${this.props.document.url}/new`);
  };

  onDelete = async () => {
    let msg;
    if (get(this.props, 'document.collection.type') === 'atlas') {
      msg =
        "Are you sure you want to delete this document and all it's child documents (if any)?";
    } else {
      msg = 'Are you sure you want to delete this document?';
    }

    if (confirm(msg)) {
      await this.props.document.delete();
      this.props.history.push(this.props.document.collection.url);
    }
  };

  onExport = () => {
    const doc = this.props.document;
    if (doc) {
      const a = document.createElement('a');
      a.textContent = 'download';
      a.download = `${doc.title}.md`;
      a.href = `data:text/markdown;charset=UTF-8,${encodeURIComponent(doc.text)}`;
      a.click();
    }
  };

  onMove = () => {
    this.props.history.push(`${this.props.document.url}/move`);
  };

  render() {
    const document = get(this.props, 'document');
    if (document) {
      const collection = document.collection;
      const allowDelete =
        collection &&
        collection.type === 'atlas' &&
        collection.documents &&
        collection.documents.length > 1;

      return (
        <DropdownMenu label={<Icon type="MoreHorizontal" />}>
          {collection &&
            <div>
              <DropdownMenuItem onClick={this.onCreateDocument}>
                New document
              </DropdownMenuItem>
            </div>}
          <DropdownMenuItem onClick={this.onMove}>Move</DropdownMenuItem>
          <DropdownMenuItem onClick={this.onExport}>Export</DropdownMenuItem>
          {allowDelete &&
            <DropdownMenuItem onClick={this.onDelete}>Delete</DropdownMenuItem>}
        </DropdownMenu>
      );
    }
    return null;
  }
}

export default withRouter(Menu);
