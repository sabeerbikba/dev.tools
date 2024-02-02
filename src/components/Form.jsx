import { Formik} from "formik";
import { Dialog, Heading, Pane, Switch, TextInput, Select } from "evergreen-ui";

export const InputType = {
    SWITCH: 1,
    TEXT_INPUT: 2,
    SELECT: 3
};

const Form = ({
    initialValues,
    onSubmit,
    title,
    formsFields,
    open,
    toggle
}) => {
    return (
        <Formik
            initialValues={initialValues}
            render={(props) => {
                return (
                    <Dialog
                        title={title}
                        isShown={open}
                        onCloseComplete={toggle}
                        onConfirm={(close) => {
                            props.submitForm();
                            close();
                        }}
                        onCancel={(close) => {
                            props.resetForm();
                            close();
                        }}
                    >
                        <>
                            {formsFields.map(({ type, key, label, isDisabled, props: _props, options }, i) => {
                                let FormField, select;
                                if (type === InputType.TEXT_INPUT) FormField = TextInput;
                                else if (type === InputType.SWITCH) FormField = Switch;
                                else if (type === InputType.SELECT)
                                    select = (
                                        <Select
                                            value={props.values[key]}
                                            onChange={props.handleChange}
                                            name={key}
                                            defaultValue={options[0].value}
                                        >
                                            {options.map(({ label, value }) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                    selected={props.values[key] === value}
                                                >
                                                    {label}
                                                </option>
                                            ))}
                                        </Select>
                                    );

                                const _isDisabled = isDisabled ? isDisabled(props.values) : undefined;

                                return (
                                    <Pane
                                        display={"flex"}
                                        alignItems="center"
                                        flexDirection={"row"}
                                        paddingY={10}
                                        key={i}
                                        justifyContent={"space-between"}
                                        {..._props}
                                    >
                                        <Heading
                                            flex={1}
                                            size={400}
                                            opacity={_isDisabled ? 0.4 : 1}
                                            textTransform={"capitalize"}
                                        >
                                            {label}
                                        </Heading>
                                        {FormField && (
                                            <FormField
                                                value={props.values[key]}
                                                checked={props.values[key]}
                                                onChange={props.handleChange}
                                                name={key}
                                                disabled={_isDisabled}
                                            />
                                        )}

                                        {select}
                                    </Pane>
                                );
                            })}
                        </>
                    </Dialog>
                );
            }}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        />
    );
};

export default Form;
