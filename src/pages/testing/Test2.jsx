import { useReducer } from "react";


import cn from "@/utils/cn";
import ToolBoxLayout from "@/common/ToolBoxLayout";
import ToolBox from "@/common/ToolBox";
import CopyBtn from "@/common/CopyBtn";
import Input from "@/common/Input";
import ExternalLink from "@/common/ExternalLink";
import PasteBtn from "@/common/PasteBtn";
import Selector from "@/common/Selector";
import TextArea from "@/common/TextArea";
import Btn from "@/common/BasicBtn";
import EndLink from "@/common/Endink";

// code that used in child component
//   --  constantTailwind
//   --  utility function

const actionTypes = {
  UPDATE_VALUE: "UPDATE_VALUE",
  UPDATE_OBJECT_VALUE: "UPDATE_OBJECT_VALUE",
};

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_VALUE: {
      return { ...state, [action.field]: action.value };
    }
    case actionTypes.UPDATE_OBJECT_VALUE: {
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          ...action.payload.value,
        },
      };
    }
    default: {
      console.error("Unknown action: " + action.type);
      console.warn(
        "you not added action.type: " + action.type + " add and try"
      );
      return state;
    }
  }
};

const Name = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {} = state;

  // //   Utility Functions   // //

  // //   Functions for Updating Reducer   // //

  const updateValues = (values) => {
    Object.keys(values).forEach((field) => {
      dispatch({ type: actionTypes.UPDATE_VALUE, field, value: values[field] });
    });
  };

  const updateObjectValue = (field, valueUpdater) => {
    const currentValue = state[field];
    const updatedValue =
      typeof valueUpdater === "function"
        ? valueUpdater(currentValue)
        : valueUpdater;

    dispatch({
      type: actionTypes.UPDATE_OBJECT_VALUE,
      payload: { field, value: updatedValue },
    });
  };

  //
  //

  // //   Event Handlers   // //

  const handlePaste = (value) => {
    updateValues({ blurhash: value });
  };

  // //   Main Functions   // //

  const tailwind = {};

  return (
    <ToolBoxLayout height="">
      <ToolBox title="Input" border></ToolBox>
      <ToolBox title="Output" border></ToolBox>
    </ToolBoxLayout>
  );
};

// child compoents

// all prop-types

export default Name;
