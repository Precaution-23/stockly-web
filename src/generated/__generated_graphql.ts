import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action_type: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  diff?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  model: Scalars['String']['output'];
  model_id?: Maybe<Scalars['ID']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['ID']['output']>;
};

export type AuditLogsQueryInput = {
  action_type?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
};

export type Auth = {
  __typename?: 'Auth';
  token: Scalars['String']['output'];
  user: User;
};

export type CreateItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateLocationInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  parent_id?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  invoice_1?: InputMaybe<Scalars['String']['input']>;
  invoice_2?: InputMaybe<Scalars['String']['input']>;
  invoice_3?: InputMaybe<Scalars['String']['input']>;
  item_id?: InputMaybe<Scalars['ID']['input']>;
  item_name: Scalars['String']['input'];
  location_id?: InputMaybe<Scalars['ID']['input']>;
  needed_by_date: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  unit_price: Scalars['Float']['input'];
  vendor_id?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  group_name: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateVendorInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  approvedRequests?: Maybe<Scalars['Int']['output']>;
  forwardedRequests?: Maybe<Scalars['Int']['output']>;
  pendingRequests?: Maybe<Scalars['Int']['output']>;
  purchasedRequests?: Maybe<Scalars['Int']['output']>;
  recentActivity?: Maybe<Array<Maybe<AuditLog>>>;
  rejectedRequests?: Maybe<Scalars['Int']['output']>;
  totalInventoryItems?: Maybe<Scalars['Int']['output']>;
  totalInventoryValue?: Maybe<Scalars['Float']['output']>;
  totalRequests?: Maybe<Scalars['Int']['output']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  item?: Maybe<Item>;
  item_id?: Maybe<Scalars['ID']['output']>;
  item_name: Scalars['String']['output'];
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['ID']['output']>;
  purchased_at?: Maybe<Scalars['Date']['output']>;
  purchased_by?: Maybe<Scalars['ID']['output']>;
  purchaser?: Maybe<User>;
  quantity: Scalars['Int']['output'];
  request_id?: Maybe<Scalars['ID']['output']>;
  total_price: Scalars['Float']['output'];
  unit_price: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  vendor?: Maybe<Vendor>;
  vendor_id?: Maybe<Scalars['ID']['output']>;
};

export type Item = {
  __typename?: 'Item';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ItemsQueryInput = {
  q?: InputMaybe<Scalars['String']['input']>;
};

export type Location = {
  __typename?: 'Location';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent_id?: Maybe<Scalars['ID']['output']>;
  parent_location?: Maybe<Location>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type LocationsQueryInput = {
  q?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveRequest?: Maybe<Request>;
  createItem?: Maybe<Item>;
  createLocation?: Maybe<Location>;
  createRequest?: Maybe<Request>;
  createRole?: Maybe<Role>;
  createUser?: Maybe<User>;
  createVendor?: Maybe<Vendor>;
  deleteItem?: Maybe<Scalars['Boolean']['output']>;
  deleteLocation?: Maybe<Scalars['Boolean']['output']>;
  deleteRequest?: Maybe<Scalars['Boolean']['output']>;
  deleteRole?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  deleteVendor?: Maybe<Scalars['Boolean']['output']>;
  forwardRequest?: Maybe<Request>;
  markPurchased?: Maybe<Request>;
  rejectRequest?: Maybe<Request>;
  updatePermission?: Maybe<Permission>;
};


export type MutationApproveRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateItemArgs = {
  payload: CreateItemInput;
};


export type MutationCreateLocationArgs = {
  payload: CreateLocationInput;
};


export type MutationCreateRequestArgs = {
  payload: CreateRequestInput;
};


export type MutationCreateRoleArgs = {
  payload: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  payload: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  payload: CreateVendorInput;
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationForwardRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkPurchasedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRejectRequestArgs = {
  payload: RejectRequestInput;
};


export type MutationUpdatePermissionArgs = {
  payload: UpdatePermissionInput;
};

export type Permission = {
  __typename?: 'Permission';
  create?: Maybe<Scalars['Boolean']['output']>;
  delete?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  read?: Maybe<Scalars['Boolean']['output']>;
  resource: Scalars['String']['output'];
  role_id?: Maybe<Scalars['ID']['output']>;
  update?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  auditLogs?: Maybe<Array<Maybe<AuditLog>>>;
  dashboardStats?: Maybe<DashboardStats>;
  inventory?: Maybe<Array<Maybe<Inventory>>>;
  items?: Maybe<Array<Maybe<Item>>>;
  locations?: Maybe<Array<Maybe<Location>>>;
  login?: Maybe<Auth>;
  me?: Maybe<User>;
  myRequests?: Maybe<Array<Maybe<Request>>>;
  requests?: Maybe<Array<Maybe<Request>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  users?: Maybe<Array<Maybe<User>>>;
  vendors?: Maybe<Array<Maybe<Vendor>>>;
};


export type QueryAuditLogsArgs = {
  payload?: InputMaybe<AuditLogsQueryInput>;
};


export type QueryItemsArgs = {
  payload?: InputMaybe<ItemsQueryInput>;
};


export type QueryLocationsArgs = {
  payload?: InputMaybe<LocationsQueryInput>;
};


export type QueryLoginArgs = {
  payload: LoginInput;
};


export type QueryRequestsArgs = {
  payload?: InputMaybe<RequestsQueryInput>;
};


export type QueryUsersArgs = {
  payload?: InputMaybe<UsersQueryInput>;
};


export type QueryVendorsArgs = {
  payload?: InputMaybe<VendorsQueryInput>;
};

export type RejectRequestInput = {
  id: Scalars['ID']['input'];
  rejection_note?: InputMaybe<Scalars['String']['input']>;
};

export type Request = {
  __typename?: 'Request';
  approver?: Maybe<User>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoice_1?: Maybe<Scalars['String']['output']>;
  invoice_2?: Maybe<Scalars['String']['output']>;
  invoice_3?: Maybe<Scalars['String']['output']>;
  item?: Maybe<Item>;
  item_id?: Maybe<Scalars['ID']['output']>;
  item_name: Scalars['String']['output'];
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['ID']['output']>;
  needed_by_date?: Maybe<Scalars['Date']['output']>;
  purchased_at?: Maybe<Scalars['Date']['output']>;
  purchaser?: Maybe<User>;
  quantity: Scalars['Int']['output'];
  rejection_note?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  status: Scalars['String']['output'];
  total_price?: Maybe<Scalars['Float']['output']>;
  unit_price: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  vendor?: Maybe<Vendor>;
  vendor_id?: Maybe<Scalars['ID']['output']>;
};

export type RequestsQueryInput = {
  q?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Role = {
  __typename?: 'Role';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UpdatePermissionInput = {
  create: Scalars['Boolean']['input'];
  delete: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
  read: Scalars['Boolean']['input'];
  update: Scalars['Boolean']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  group_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_active?: Maybe<Scalars['Boolean']['output']>;
  last_name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  role?: Maybe<Role>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UsersQueryInput = {
  q?: InputMaybe<Scalars['String']['input']>;
};

export type Vendor = {
  __typename?: 'Vendor';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type VendorsQueryInput = {
  q?: InputMaybe<Scalars['String']['input']>;
};

export type AuditLogFragmentFragment = { __typename?: 'AuditLog', id: string, action_type: string, model: string, model_id?: string | null, diff?: string | null, createdAt?: any | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null };

export type InventoryFragmentFragment = { __typename?: 'Inventory', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price: number, vendor_id?: string | null, location_id?: string | null, purchased_by?: string | null, purchased_at?: any | null, createdAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null };

export type RequestFragmentFragment = { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null };

export type UserFragmentFragment = { __typename?: 'User', id: string, first_name: string, last_name: string, email: string, group_name?: string | null, is_active?: boolean | null, createdAt?: any | null, role?: { __typename?: 'Role', id: string, name: string, description?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null };

export type ApproveRequestMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveRequestMutation = { __typename?: 'Mutation', approveRequest?: { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null };

export type CreateItemMutationVariables = Exact<{
  payload: CreateItemInput;
}>;


export type CreateItemMutation = { __typename?: 'Mutation', createItem?: { __typename?: 'Item', id: string, name: string, description?: string | null, createdAt?: any | null } | null };

export type CreateLocationMutationVariables = Exact<{
  payload: CreateLocationInput;
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation?: { __typename?: 'Location', id: string, name: string, parent_id?: string | null, createdAt?: any | null, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null };

export type CreateRequestMutationVariables = Exact<{
  payload: CreateRequestInput;
}>;


export type CreateRequestMutation = { __typename?: 'Mutation', createRequest?: { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null };

export type CreateRoleMutationVariables = Exact<{
  payload: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole?: { __typename?: 'Role', id: string, name: string, description?: string | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } | null };

export type CreateUserMutationVariables = Exact<{
  payload: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string, group_name?: string | null, is_active?: boolean | null, createdAt?: any | null, role?: { __typename?: 'Role', id: string, name: string, description?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } | null };

export type CreateVendorMutationVariables = Exact<{
  payload: CreateVendorInput;
}>;


export type CreateVendorMutation = { __typename?: 'Mutation', createVendor?: { __typename?: 'Vendor', id: string, name: string, description?: string | null, createdAt?: any | null } | null };

export type DeleteItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteItemMutation = { __typename?: 'Mutation', deleteItem?: boolean | null };

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLocationMutation = { __typename?: 'Mutation', deleteLocation?: boolean | null };

export type DeleteRequestMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRequestMutation = { __typename?: 'Mutation', deleteRequest?: boolean | null };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleteRole?: boolean | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };

export type DeleteVendorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteVendorMutation = { __typename?: 'Mutation', deleteVendor?: boolean | null };

export type ForwardRequestMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ForwardRequestMutation = { __typename?: 'Mutation', forwardRequest?: { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null };

export type MarkPurchasedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkPurchasedMutation = { __typename?: 'Mutation', markPurchased?: { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null };

export type RejectRequestMutationVariables = Exact<{
  payload: RejectRequestInput;
}>;


export type RejectRequestMutation = { __typename?: 'Mutation', rejectRequest?: { __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null };

export type UpdatePermissionMutationVariables = Exact<{
  payload: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { __typename?: 'Mutation', updatePermission?: { __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null };

export type AuditLogsQueryVariables = Exact<{
  payload?: InputMaybe<AuditLogsQueryInput>;
}>;


export type AuditLogsQuery = { __typename?: 'Query', auditLogs?: Array<{ __typename?: 'AuditLog', id: string, action_type: string, model: string, model_id?: string | null, diff?: string | null, createdAt?: any | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null> | null };

export type DashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardStatsQuery = { __typename?: 'Query', dashboardStats?: { __typename?: 'DashboardStats', totalRequests?: number | null, pendingRequests?: number | null, forwardedRequests?: number | null, approvedRequests?: number | null, rejectedRequests?: number | null, purchasedRequests?: number | null, totalInventoryItems?: number | null, totalInventoryValue?: number | null, recentActivity?: Array<{ __typename?: 'AuditLog', id: string, action_type: string, model: string, model_id?: string | null, diff?: string | null, createdAt?: any | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null> | null } | null };

export type InventoryQueryVariables = Exact<{ [key: string]: never; }>;


export type InventoryQuery = { __typename?: 'Query', inventory?: Array<{ __typename?: 'Inventory', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price: number, vendor_id?: string | null, location_id?: string | null, purchased_by?: string | null, purchased_at?: any | null, createdAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null> | null };

export type ItemsQueryVariables = Exact<{
  payload?: InputMaybe<ItemsQueryInput>;
}>;


export type ItemsQuery = { __typename?: 'Query', items?: Array<{ __typename?: 'Item', id: string, name: string, description?: string | null, createdAt?: any | null } | null> | null };

export type LocationsQueryVariables = Exact<{
  payload?: InputMaybe<LocationsQueryInput>;
}>;


export type LocationsQuery = { __typename?: 'Query', locations?: Array<{ __typename?: 'Location', id: string, name: string, parent_id?: string | null, createdAt?: any | null, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null> | null };

export type LoginQueryVariables = Exact<{
  payload: LoginInput;
}>;


export type LoginQuery = { __typename?: 'Query', login?: { __typename?: 'Auth', token: string, user: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string, group_name?: string | null, is_active?: boolean | null, createdAt?: any | null, role?: { __typename?: 'Role', id: string, name: string, description?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string, group_name?: string | null, is_active?: boolean | null, createdAt?: any | null, role?: { __typename?: 'Role', id: string, name: string, description?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } | null };

export type MyRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRequestsQuery = { __typename?: 'Query', myRequests?: Array<{ __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null> | null };

export type RequestsQueryVariables = Exact<{
  payload?: InputMaybe<RequestsQueryInput>;
}>;


export type RequestsQuery = { __typename?: 'Query', requests?: Array<{ __typename?: 'Request', id: string, item_id?: string | null, item_name: string, quantity: number, unit_price: number, total_price?: number | null, needed_by_date?: any | null, vendor_id?: string | null, location_id?: string | null, description?: string | null, invoice_1?: string | null, invoice_2?: string | null, invoice_3?: string | null, status: string, rejection_note?: string | null, purchased_at?: any | null, createdAt?: any | null, updatedAt?: any | null, item?: { __typename?: 'Item', id: string, name: string } | null, vendor?: { __typename?: 'Vendor', id: string, name: string } | null, location?: { __typename?: 'Location', id: string, name: string, parent_location?: { __typename?: 'Location', id: string, name: string } | null } | null, creator?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, reviewer?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, approver?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null, purchaser?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string } | null } | null> | null };

export type RolesQueryVariables = Exact<{ [key: string]: never; }>;


export type RolesQuery = { __typename?: 'Query', roles?: Array<{ __typename?: 'Role', id: string, name: string, description?: string | null, createdAt?: any | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } | null> | null };

export type UsersQueryVariables = Exact<{
  payload?: InputMaybe<UsersQueryInput>;
}>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string, email: string, group_name?: string | null, is_active?: boolean | null, createdAt?: any | null, role?: { __typename?: 'Role', id: string, name: string, description?: string | null } | null, permissions?: Array<{ __typename?: 'Permission', id: string, resource: string, create?: boolean | null, read?: boolean | null, update?: boolean | null, delete?: boolean | null } | null> | null } | null> | null };

export type VendorsQueryVariables = Exact<{
  payload?: InputMaybe<VendorsQueryInput>;
}>;


export type VendorsQuery = { __typename?: 'Query', vendors?: Array<{ __typename?: 'Vendor', id: string, name: string, description?: string | null, createdAt?: any | null } | null> | null };

export const AuditLogFragmentFragmentDoc = gql`
    fragment AuditLogFragment on AuditLog {
  id
  action_type
  model
  model_id
  diff
  createdAt
  user {
    id
    first_name
    last_name
    email
  }
}
    `;
export const InventoryFragmentFragmentDoc = gql`
    fragment InventoryFragment on Inventory {
  id
  item_id
  item_name
  quantity
  unit_price
  total_price
  vendor_id
  location_id
  purchased_by
  purchased_at
  createdAt
  item {
    id
    name
  }
  vendor {
    id
    name
  }
  location {
    id
    name
  }
  purchaser {
    id
    first_name
    last_name
  }
}
    `;
export const RequestFragmentFragmentDoc = gql`
    fragment RequestFragment on Request {
  id
  item_id
  item_name
  quantity
  unit_price
  total_price
  needed_by_date
  vendor_id
  location_id
  description
  invoice_1
  invoice_2
  invoice_3
  status
  rejection_note
  purchased_at
  createdAt
  updatedAt
  item {
    id
    name
  }
  vendor {
    id
    name
  }
  location {
    id
    name
    parent_location {
      id
      name
    }
  }
  creator {
    id
    first_name
    last_name
    email
  }
  reviewer {
    id
    first_name
    last_name
    email
  }
  approver {
    id
    first_name
    last_name
    email
  }
  purchaser {
    id
    first_name
    last_name
    email
  }
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  first_name
  last_name
  email
  group_name
  is_active
  createdAt
  role {
    id
    name
    description
  }
  permissions {
    id
    resource
    create
    read
    update
    delete
  }
}
    `;
export const ApproveRequestDocument = gql`
    mutation approveRequest($id: ID!) {
  approveRequest(id: $id) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useApproveRequestMutation__
 *
 * To run a mutation, you first call `useApproveRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useApproveRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useApproveRequestMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useApproveRequestMutation(options: VueApolloComposable.UseMutationOptions<ApproveRequestMutation, ApproveRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ApproveRequestMutation, ApproveRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ApproveRequestMutation, ApproveRequestMutationVariables>(ApproveRequestDocument, options);
}
export type ApproveRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ApproveRequestMutation, ApproveRequestMutationVariables>;
export const CreateItemDocument = gql`
    mutation createItem($payload: CreateItemInput!) {
  createItem(payload: $payload) {
    id
    name
    description
    createdAt
  }
}
    `;

/**
 * __useCreateItemMutation__
 *
 * To run a mutation, you first call `useCreateItemMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateItemMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateItemMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateItemMutation(options: VueApolloComposable.UseMutationOptions<CreateItemMutation, CreateItemMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateItemMutation, CreateItemMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateItemMutation, CreateItemMutationVariables>(CreateItemDocument, options);
}
export type CreateItemMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateItemMutation, CreateItemMutationVariables>;
export const CreateLocationDocument = gql`
    mutation createLocation($payload: CreateLocationInput!) {
  createLocation(payload: $payload) {
    id
    name
    parent_id
    parent_location {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useCreateLocationMutation__
 *
 * To run a mutation, you first call `useCreateLocationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateLocationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateLocationMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateLocationMutation(options: VueApolloComposable.UseMutationOptions<CreateLocationMutation, CreateLocationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateLocationMutation, CreateLocationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateLocationMutation, CreateLocationMutationVariables>(CreateLocationDocument, options);
}
export type CreateLocationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateLocationMutation, CreateLocationMutationVariables>;
export const CreateRequestDocument = gql`
    mutation createRequest($payload: CreateRequestInput!) {
  createRequest(payload: $payload) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useCreateRequestMutation__
 *
 * To run a mutation, you first call `useCreateRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateRequestMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateRequestMutation(options: VueApolloComposable.UseMutationOptions<CreateRequestMutation, CreateRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateRequestMutation, CreateRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateRequestMutation, CreateRequestMutationVariables>(CreateRequestDocument, options);
}
export type CreateRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateRequestMutation, CreateRequestMutationVariables>;
export const CreateRoleDocument = gql`
    mutation createRole($payload: CreateRoleInput!) {
  createRole(payload: $payload) {
    id
    name
    description
    permissions {
      id
      resource
      create
      read
      update
      delete
    }
  }
}
    `;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateRoleMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateRoleMutation(options: VueApolloComposable.UseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
}
export type CreateRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($payload: CreateUserInput!) {
  createUser(payload: $payload) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateUserMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateUserMutation(options: VueApolloComposable.UseMutationOptions<CreateUserMutation, CreateUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateUserMutation, CreateUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
}
export type CreateUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateUserMutation, CreateUserMutationVariables>;
export const CreateVendorDocument = gql`
    mutation createVendor($payload: CreateVendorInput!) {
  createVendor(payload: $payload) {
    id
    name
    description
    createdAt
  }
}
    `;

/**
 * __useCreateVendorMutation__
 *
 * To run a mutation, you first call `useCreateVendorMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateVendorMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateVendorMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useCreateVendorMutation(options: VueApolloComposable.UseMutationOptions<CreateVendorMutation, CreateVendorMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateVendorMutation, CreateVendorMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateVendorMutation, CreateVendorMutationVariables>(CreateVendorDocument, options);
}
export type CreateVendorMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateVendorMutation, CreateVendorMutationVariables>;
export const DeleteItemDocument = gql`
    mutation deleteItem($id: ID!) {
  deleteItem(id: $id)
}
    `;

/**
 * __useDeleteItemMutation__
 *
 * To run a mutation, you first call `useDeleteItemMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteItemMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteItemMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteItemMutation(options: VueApolloComposable.UseMutationOptions<DeleteItemMutation, DeleteItemMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteItemMutation, DeleteItemMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteItemMutation, DeleteItemMutationVariables>(DeleteItemDocument, options);
}
export type DeleteItemMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteItemMutation, DeleteItemMutationVariables>;
export const DeleteLocationDocument = gql`
    mutation deleteLocation($id: ID!) {
  deleteLocation(id: $id)
}
    `;

/**
 * __useDeleteLocationMutation__
 *
 * To run a mutation, you first call `useDeleteLocationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLocationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteLocationMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLocationMutation(options: VueApolloComposable.UseMutationOptions<DeleteLocationMutation, DeleteLocationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteLocationMutation, DeleteLocationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteLocationMutation, DeleteLocationMutationVariables>(DeleteLocationDocument, options);
}
export type DeleteLocationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteLocationMutation, DeleteLocationMutationVariables>;
export const DeleteRequestDocument = gql`
    mutation deleteRequest($id: ID!) {
  deleteRequest(id: $id)
}
    `;

/**
 * __useDeleteRequestMutation__
 *
 * To run a mutation, you first call `useDeleteRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteRequestMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRequestMutation(options: VueApolloComposable.UseMutationOptions<DeleteRequestMutation, DeleteRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteRequestMutation, DeleteRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteRequestMutation, DeleteRequestMutationVariables>(DeleteRequestDocument, options);
}
export type DeleteRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteRequestMutation, DeleteRequestMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation deleteRole($id: ID!) {
  deleteRole(id: $id)
}
    `;

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteRoleMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRoleMutation(options: VueApolloComposable.UseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, options);
}
export type DeleteRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const DeleteUserDocument = gql`
    mutation deleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteUserMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(options: VueApolloComposable.UseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
}
export type DeleteUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteUserMutation, DeleteUserMutationVariables>;
export const DeleteVendorDocument = gql`
    mutation deleteVendor($id: ID!) {
  deleteVendor(id: $id)
}
    `;

/**
 * __useDeleteVendorMutation__
 *
 * To run a mutation, you first call `useDeleteVendorMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVendorMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteVendorMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useDeleteVendorMutation(options: VueApolloComposable.UseMutationOptions<DeleteVendorMutation, DeleteVendorMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteVendorMutation, DeleteVendorMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteVendorMutation, DeleteVendorMutationVariables>(DeleteVendorDocument, options);
}
export type DeleteVendorMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteVendorMutation, DeleteVendorMutationVariables>;
export const ForwardRequestDocument = gql`
    mutation forwardRequest($id: ID!) {
  forwardRequest(id: $id) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useForwardRequestMutation__
 *
 * To run a mutation, you first call `useForwardRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useForwardRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useForwardRequestMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useForwardRequestMutation(options: VueApolloComposable.UseMutationOptions<ForwardRequestMutation, ForwardRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ForwardRequestMutation, ForwardRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ForwardRequestMutation, ForwardRequestMutationVariables>(ForwardRequestDocument, options);
}
export type ForwardRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ForwardRequestMutation, ForwardRequestMutationVariables>;
export const MarkPurchasedDocument = gql`
    mutation markPurchased($id: ID!) {
  markPurchased(id: $id) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useMarkPurchasedMutation__
 *
 * To run a mutation, you first call `useMarkPurchasedMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useMarkPurchasedMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useMarkPurchasedMutation({
 *   variables: {
 *     id: // value for 'id'
 *   },
 * });
 */
export function useMarkPurchasedMutation(options: VueApolloComposable.UseMutationOptions<MarkPurchasedMutation, MarkPurchasedMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<MarkPurchasedMutation, MarkPurchasedMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<MarkPurchasedMutation, MarkPurchasedMutationVariables>(MarkPurchasedDocument, options);
}
export type MarkPurchasedMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<MarkPurchasedMutation, MarkPurchasedMutationVariables>;
export const RejectRequestDocument = gql`
    mutation rejectRequest($payload: RejectRequestInput!) {
  rejectRequest(payload: $payload) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useRejectRequestMutation__
 *
 * To run a mutation, you first call `useRejectRequestMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRejectRequestMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRejectRequestMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useRejectRequestMutation(options: VueApolloComposable.UseMutationOptions<RejectRequestMutation, RejectRequestMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RejectRequestMutation, RejectRequestMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RejectRequestMutation, RejectRequestMutationVariables>(RejectRequestDocument, options);
}
export type RejectRequestMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RejectRequestMutation, RejectRequestMutationVariables>;
export const UpdatePermissionDocument = gql`
    mutation updatePermission($payload: UpdatePermissionInput!) {
  updatePermission(payload: $payload) {
    id
    resource
    create
    read
    update
    delete
  }
}
    `;

/**
 * __useUpdatePermissionMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdatePermissionMutation({
 *   variables: {
 *     payload: // value for 'payload'
 *   },
 * });
 */
export function useUpdatePermissionMutation(options: VueApolloComposable.UseMutationOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdatePermissionMutation, UpdatePermissionMutationVariables>(UpdatePermissionDocument, options);
}
export type UpdatePermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const AuditLogsDocument = gql`
    query auditLogs($payload: AuditLogsQueryInput) {
  auditLogs(payload: $payload) {
    ...AuditLogFragment
  }
}
    ${AuditLogFragmentFragmentDoc}`;

/**
 * __useAuditLogsQuery__
 *
 * To run a query within a Vue component, call `useAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuditLogsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAuditLogsQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useAuditLogsQuery(variables: AuditLogsQueryVariables | VueCompositionApi.Ref<AuditLogsQueryVariables> | ReactiveFunction<AuditLogsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AuditLogsQuery, AuditLogsQueryVariables>(AuditLogsDocument, variables, options);
}
export function useAuditLogsLazyQuery(variables: AuditLogsQueryVariables | VueCompositionApi.Ref<AuditLogsQueryVariables> | ReactiveFunction<AuditLogsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AuditLogsQuery, AuditLogsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AuditLogsQuery, AuditLogsQueryVariables>(AuditLogsDocument, variables, options);
}
export type AuditLogsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AuditLogsQuery, AuditLogsQueryVariables>;
export const DashboardStatsDocument = gql`
    query dashboardStats {
  dashboardStats {
    totalRequests
    pendingRequests
    forwardedRequests
    approvedRequests
    rejectedRequests
    purchasedRequests
    totalInventoryItems
    totalInventoryValue
    recentActivity {
      ...AuditLogFragment
    }
  }
}
    ${AuditLogFragmentFragmentDoc}`;

/**
 * __useDashboardStatsQuery__
 *
 * To run a query within a Vue component, call `useDashboardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardStatsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useDashboardStatsQuery();
 */
export function useDashboardStatsQuery(options: VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<DashboardStatsQuery, DashboardStatsQueryVariables>(DashboardStatsDocument, {}, options);
}
export function useDashboardStatsLazyQuery(options: VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<DashboardStatsQuery, DashboardStatsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<DashboardStatsQuery, DashboardStatsQueryVariables>(DashboardStatsDocument, {}, options);
}
export type DashboardStatsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<DashboardStatsQuery, DashboardStatsQueryVariables>;
export const InventoryDocument = gql`
    query inventory {
  inventory {
    ...InventoryFragment
  }
}
    ${InventoryFragmentFragmentDoc}`;

/**
 * __useInventoryQuery__
 *
 * To run a query within a Vue component, call `useInventoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useInventoryQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useInventoryQuery();
 */
export function useInventoryQuery(options: VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<InventoryQuery, InventoryQueryVariables>(InventoryDocument, {}, options);
}
export function useInventoryLazyQuery(options: VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<InventoryQuery, InventoryQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<InventoryQuery, InventoryQueryVariables>(InventoryDocument, {}, options);
}
export type InventoryQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<InventoryQuery, InventoryQueryVariables>;
export const ItemsDocument = gql`
    query items($payload: ItemsQueryInput) {
  items(payload: $payload) {
    id
    name
    description
    createdAt
  }
}
    `;

/**
 * __useItemsQuery__
 *
 * To run a query within a Vue component, call `useItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useItemsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useItemsQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useItemsQuery(variables: ItemsQueryVariables | VueCompositionApi.Ref<ItemsQueryVariables> | ReactiveFunction<ItemsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ItemsQuery, ItemsQueryVariables>(ItemsDocument, variables, options);
}
export function useItemsLazyQuery(variables: ItemsQueryVariables | VueCompositionApi.Ref<ItemsQueryVariables> | ReactiveFunction<ItemsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ItemsQuery, ItemsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ItemsQuery, ItemsQueryVariables>(ItemsDocument, variables, options);
}
export type ItemsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ItemsQuery, ItemsQueryVariables>;
export const LocationsDocument = gql`
    query locations($payload: LocationsQueryInput) {
  locations(payload: $payload) {
    id
    name
    parent_id
    parent_location {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useLocationsQuery__
 *
 * To run a query within a Vue component, call `useLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocationsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useLocationsQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useLocationsQuery(variables: LocationsQueryVariables | VueCompositionApi.Ref<LocationsQueryVariables> | ReactiveFunction<LocationsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<LocationsQuery, LocationsQueryVariables>(LocationsDocument, variables, options);
}
export function useLocationsLazyQuery(variables: LocationsQueryVariables | VueCompositionApi.Ref<LocationsQueryVariables> | ReactiveFunction<LocationsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LocationsQuery, LocationsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<LocationsQuery, LocationsQueryVariables>(LocationsDocument, variables, options);
}
export type LocationsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<LocationsQuery, LocationsQueryVariables>;
export const LoginDocument = gql`
    query Login($payload: LoginInput!) {
  login(payload: $payload) {
    token
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useLoginQuery__
 *
 * To run a query within a Vue component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useLoginQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useLoginQuery(variables: LoginQueryVariables | VueCompositionApi.Ref<LoginQueryVariables> | ReactiveFunction<LoginQueryVariables>, options: VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, variables, options);
}
export function useLoginLazyQuery(variables?: LoginQueryVariables | VueCompositionApi.Ref<LoginQueryVariables> | ReactiveFunction<LoginQueryVariables>, options: VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<LoginQuery, LoginQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, variables, options);
}
export type LoginQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<LoginQuery, LoginQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a Vue component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMeQuery();
 */
export function useMeQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export function useMeLazyQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export type MeQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MeQuery, MeQueryVariables>;
export const MyRequestsDocument = gql`
    query myRequests {
  myRequests {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useMyRequestsQuery__
 *
 * To run a query within a Vue component, call `useMyRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyRequestsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMyRequestsQuery();
 */
export function useMyRequestsQuery(options: VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MyRequestsQuery, MyRequestsQueryVariables>(MyRequestsDocument, {}, options);
}
export function useMyRequestsLazyQuery(options: VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyRequestsQuery, MyRequestsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MyRequestsQuery, MyRequestsQueryVariables>(MyRequestsDocument, {}, options);
}
export type MyRequestsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MyRequestsQuery, MyRequestsQueryVariables>;
export const RequestsDocument = gql`
    query requests($payload: RequestsQueryInput) {
  requests(payload: $payload) {
    ...RequestFragment
  }
}
    ${RequestFragmentFragmentDoc}`;

/**
 * __useRequestsQuery__
 *
 * To run a query within a Vue component, call `useRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useRequestsQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useRequestsQuery(variables: RequestsQueryVariables | VueCompositionApi.Ref<RequestsQueryVariables> | ReactiveFunction<RequestsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<RequestsQuery, RequestsQueryVariables>(RequestsDocument, variables, options);
}
export function useRequestsLazyQuery(variables: RequestsQueryVariables | VueCompositionApi.Ref<RequestsQueryVariables> | ReactiveFunction<RequestsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<RequestsQuery, RequestsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<RequestsQuery, RequestsQueryVariables>(RequestsDocument, variables, options);
}
export type RequestsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<RequestsQuery, RequestsQueryVariables>;
export const RolesDocument = gql`
    query roles {
  roles {
    id
    name
    description
    permissions {
      id
      resource
      create
      read
      update
      delete
    }
    createdAt
  }
}
    `;

/**
 * __useRolesQuery__
 *
 * To run a query within a Vue component, call `useRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRolesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useRolesQuery();
 */
export function useRolesQuery(options: VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<RolesQuery, RolesQueryVariables>(RolesDocument, {}, options);
}
export function useRolesLazyQuery(options: VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<RolesQuery, RolesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<RolesQuery, RolesQueryVariables>(RolesDocument, {}, options);
}
export type RolesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<RolesQuery, RolesQueryVariables>;
export const UsersDocument = gql`
    query users($payload: UsersQueryInput) {
  users(payload: $payload) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a Vue component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useUsersQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useUsersQuery(variables: UsersQueryVariables | VueCompositionApi.Ref<UsersQueryVariables> | ReactiveFunction<UsersQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, variables, options);
}
export function useUsersLazyQuery(variables: UsersQueryVariables | VueCompositionApi.Ref<UsersQueryVariables> | ReactiveFunction<UsersQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UsersQuery, UsersQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, variables, options);
}
export type UsersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UsersQuery, UsersQueryVariables>;
export const VendorsDocument = gql`
    query vendors($payload: VendorsQueryInput) {
  vendors(payload: $payload) {
    id
    name
    description
    createdAt
  }
}
    `;

/**
 * __useVendorsQuery__
 *
 * To run a query within a Vue component, call `useVendorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVendorsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useVendorsQuery({
 *   payload: // value for 'payload'
 * });
 */
export function useVendorsQuery(variables: VendorsQueryVariables | VueCompositionApi.Ref<VendorsQueryVariables> | ReactiveFunction<VendorsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<VendorsQuery, VendorsQueryVariables>(VendorsDocument, variables, options);
}
export function useVendorsLazyQuery(variables: VendorsQueryVariables | VueCompositionApi.Ref<VendorsQueryVariables> | ReactiveFunction<VendorsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<VendorsQuery, VendorsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<VendorsQuery, VendorsQueryVariables>(VendorsDocument, variables, options);
}
export type VendorsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<VendorsQuery, VendorsQueryVariables>;