import React, { SFC } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { IFolderChild } from "sidebar/types";
import Item from "sidebar/folder/Item";
import FolderContainer from "sidebar/folder/FolderContainer";

import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import ExpandLess from "@material-ui/icons/ExpandMore";
import ExpandMore from "@material-ui/icons/KeyboardArrowRight";

interface IProps extends WithStyles<typeof styles, true> {
  label: string;
  handleClick: () => void;
  expanded: boolean;
  childFolders: IFolderChild[];
  nested: number;
  CutomFolderIcon?: React.ComponentType<SvgIconProps>;
  disabled?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      color: "#696969"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    expand: {
      marginRight: theme.spacing.unit
    }
  });

const Folder: SFC<IProps> = ({
  classes,
  label,
  childFolders,
  handleClick,
  expanded,
  nested,
  theme,
  CutomFolderIcon,
  disabled
}) => {
  const icon =
    CutomFolderIcon != null ? (
      <CutomFolderIcon className={classes.icon} />
    ) : expanded ? (
      <FolderOpenIcon className={classes.icon} />
    ) : (
      <FolderIcon className={classes.icon} />
    );

  return (
    <>
      <ListItem
        disabled={disabled}
        divider
        button
        onClick={handleClick}
        style={{ paddingLeft: nested * theme.spacing.unit * 2 }}
      >
        <ListItemIcon className={classes.expand}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          classes={{
            primary: classes.heading
          }}
        />
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List disablePadding component="nav">
          {childFolders.map(
            ({
              ChildType,
              ChildFolderId,
              ChildFolder,
              ChildItemId,
              ChildItem
            }) =>
              ChildType === "F" ? (
                <FolderContainer
                  nested={nested + 1}
                  key={ChildFolderId}
                  label={ChildFolder.Label}
                  childFolders={ChildFolder.Children}
                />
              ) : (
                <Item
                  nested={nested + 1}
                  key={ChildItemId}
                  itemTypeId={ChildItem.ItemTypeId}
                  itemId={ChildItem.ItemId}
                  label={ChildItem.Label}
                />
              )
          )}
        </List>
      </Collapse>
    </>
  );
};

export default withStyles(styles, { withTheme: true })(Folder);