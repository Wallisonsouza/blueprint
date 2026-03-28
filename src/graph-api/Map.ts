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

export const PORT_COLORS: Record<TypeKind, number> = {
  number: 0x3498db,
  string: 0xf1c40f,
  boolean: 0xe67e22,
  any: 0x7f8c8d,
  exec: 0xe74c3c,
  void: 0x95a5a6,
};