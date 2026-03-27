export const Types = {
  Number: "number",
  String: "string",
  Boolean: "boolean",
  Any: "any",
  Void: "void",
  Exec: "exec"

} as const;

export type TypeKind = typeof Types[keyof typeof Types];

export type PortTypeMap = {
  [Types.Number]: number;
  [Types.String]: string;
  [Types.Boolean]: boolean;
  [Types.Any]: any;
  [Types.Void]: void;

};

export const PORT_COLORS: Record<TypeKind, string> = {
  number: "#6a5acd",
  string: "#f1c40f",
  boolean: "#e67e22",
  any: "#7f8c8d",
  exec: "red",
  void: "#95a5a6",
};