export interface CONFIG_GET_ITEM_TYPES_LIST_PARAMS {



}
export interface CONFIG_GET_ITEM_TYPES_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_ITEM_TYPES_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_ITEM_TYPE_PARAMS {
  body: {
    name: string;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_ITEM_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_CREATE_ITEM_TYPE_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_ITEM_TYPE_DETAIL_PARAMS {


  path: {
    item_type_id: number;
  };
}
export interface CONFIG_GET_ITEM_TYPE_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_GET_ITEM_TYPE_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_ITEM_TYPE_PARAMS {
  body: {
    name: string;
    is_active: boolean;
  };

  path: {
    item_type_id: number;
  };
}
export interface CONFIG_UPDATE_ITEM_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_UPDATE_ITEM_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_ITEM_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_ITEM_TYPE_PARAMS {
  body: {
    name?: string;
    is_active?: boolean;
  };

  path: {
    item_type_id: number;
  };
}
export interface CONFIG_PATCH_ITEM_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_ITEM_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_ITEM_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_ITEM_TYPE_PARAMS {


  path: {
    item_type_id: number;
  };
}
export interface CONFIG_DELETE_ITEM_TYPE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_ITEM_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_ITEM_TYPE_PARAMS {


  path: {
    item_type_id: number;
  };
}
export interface CONFIG_ACTIVATE_ITEM_TYPE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ACTIVATE_ITEM_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_ITEM_TYPE_PARAMS {


  path: {
    item_type_id: number;
  };
}
export interface CONFIG_DEACTIVATE_ITEM_TYPE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DEACTIVATE_ITEM_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_ITEM_TYPES_STATS_PARAMS {



}
export interface CONFIG_GET_ITEM_TYPES_STATS_RESPONSE_200 {
  total: number;
  active: number;
  inactive: number;
}
export interface CONFIG_GET_ITEM_TYPES_STATS_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_GET_ITEMS_LIST_PARAMS {

  query: {
    is_active?: boolean;
    search?: string;
    ordering?: string;
    item_type?: number;
    category?: number;
    kitchen_area?: number;
    price_min?: number;
    price_max?: number;
    temps_max?: number;
    has_allergene?: boolean;
  };

}
export interface CONFIG_GET_ITEMS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    display_name: string;
    item_type: number;
    price: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_ITEMS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_ITEM_PARAMS {
  body: {
    name: string;
    item_type: number;
    display_name?: string;
    description?: string;
    price: number;
    nb_portion_min?: number;
    temps_preparation?: number;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_ITEM_RESPONSE_200 {
  id: number;
  name: string;
  item_type: number;
  price: number;
  is_active: boolean;
}
export interface CONFIG_CREATE_ITEM_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_ITEM_DETAIL_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_GET_ITEM_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  display_name: string;
  description: string;
  item_type: number;
  price: number;
  nb_portion_min: number;
  temps_preparation: number;
  is_active: boolean;
}
export interface CONFIG_GET_ITEM_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_ITEM_PARAMS {
  body: {
    name: string;
    item_type: number;
    price: number;
    is_active: boolean;
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_UPDATE_ITEM_RESPONSE_200 {
  id: number;
  name: string;
  item_type: number;
  price: number;
  is_active: boolean;
}
export interface CONFIG_UPDATE_ITEM_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_ITEM_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_ITEM_PARAMS {
  body: {
    name?: string;
    item_type?: number;
    display_name?: string;
    description?: string;
    price?: number;
    nb_portion_min?: number;
    temps_preparation?: number;
    is_active?: boolean;
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_PATCH_ITEM_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_ITEM_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_ITEM_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_ITEM_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_DELETE_ITEM_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_ITEM_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_ITEM_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_ACTIVATE_ITEM_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ACTIVATE_ITEM_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_ITEM_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_DEACTIVATE_ITEM_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DEACTIVATE_ITEM_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_ITEMS_STATS_PARAMS {



}
export interface CONFIG_GET_ITEMS_STATS_RESPONSE_200 {
  total: number;
  active: number;
  inactive: number;
}
export interface CONFIG_GET_ITEMS_STATS_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_GET_ITEM_CATEGORIES_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_GET_ITEM_CATEGORIES_RESPONSE_200 {
  results: {
    id: number;
    name: string;
  }[];
}
export interface CONFIG_GET_ITEM_CATEGORIES_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ADD_ITEM_CATEGORIES_PARAMS {
  body: {
    category_ids: number[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_ADD_ITEM_CATEGORIES_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ADD_ITEM_CATEGORIES_RESPONSE_400 {
  error: string;
}
export interface CONFIG_ADD_ITEM_CATEGORIES_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REMOVE_ITEM_CATEGORIES_PARAMS {
  body: {
    category_ids: number[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_REMOVE_ITEM_CATEGORIES_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REMOVE_ITEM_CATEGORIES_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REMOVE_ITEM_CATEGORIES_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_ITEM_KITCHEN_AREAS_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_GET_ITEM_KITCHEN_AREAS_RESPONSE_200 {
  results: {
    id: number;
    name: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_ITEM_KITCHEN_AREAS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ADD_ITEM_KITCHEN_AREAS_PARAMS {
  body: {
    kitchen_area_ids: number[];
    is_active: boolean;
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_ADD_ITEM_KITCHEN_AREAS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ADD_ITEM_KITCHEN_AREAS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_ADD_ITEM_KITCHEN_AREAS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_TOGGLE_ITEM_KITCHEN_AREA_PARAMS {
  body: {
    is_active: boolean;
  };

  path: {
    item_id: number;
    kitchen_area_id: number;
  };
}
export interface CONFIG_TOGGLE_ITEM_KITCHEN_AREA_RESPONSE_200 {
  message: string;
}
export interface CONFIG_TOGGLE_ITEM_KITCHEN_AREA_RESPONSE_400 {
  error: string;
}
export interface CONFIG_TOGGLE_ITEM_KITCHEN_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REMOVE_ITEM_KITCHEN_AREAS_PARAMS {
  body: {
    kitchen_area_ids: number[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_REMOVE_ITEM_KITCHEN_AREAS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REMOVE_ITEM_KITCHEN_AREAS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REMOVE_ITEM_KITCHEN_AREAS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_ITEM_OPTION_GROUPS_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_GET_ITEM_OPTION_GROUPS_RESPONSE_200 {
  results: {
    id: number;
    name: string;
    is_mandatory: boolean;
    selection_type: string;
    max_selections: number;
  }[];
}
export interface CONFIG_GET_ITEM_OPTION_GROUPS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ADD_ITEM_OPTION_GROUP_PARAMS {
  body: {
    group_option_id: number;
    is_mandatory: boolean;
    selection_type: string;
    max_selections: number;
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_ADD_ITEM_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ADD_ITEM_OPTION_GROUP_RESPONSE_400 {
  error: string;
}
export interface CONFIG_ADD_ITEM_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_ITEM_OPTION_GROUP_PARAMS {
  body: {
    is_mandatory?: boolean;
    selection_type?: string;
    max_selections?: number;
  };

  path: {
    item_id: number;
    option_group_id: number;
  };
}
export interface CONFIG_UPDATE_ITEM_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_UPDATE_ITEM_OPTION_GROUP_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_ITEM_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REMOVE_ITEM_OPTION_GROUPS_PARAMS {
  body: {
    group_option_ids: number[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_REMOVE_ITEM_OPTION_GROUPS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REMOVE_ITEM_OPTION_GROUPS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REMOVE_ITEM_OPTION_GROUPS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_ITEM_INGREDIENTS_PARAMS {


  path: {
    item_id: number;
  };
}
export interface CONFIG_GET_ITEM_INGREDIENTS_RESPONSE_200 {
  results: {
    id: number;
    name: string;
    quantity: number;
    quantity_type_id: number;
    is_optional: boolean;
  }[];
}
export interface CONFIG_GET_ITEM_INGREDIENTS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ADD_ITEM_INGREDIENTS_PARAMS {
  body: {
    ingredients: {
      ingredient_id: number;
      quantity: number;
      quantity_type_id: number;
      is_optional: boolean;
    }[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_ADD_ITEM_INGREDIENTS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ADD_ITEM_INGREDIENTS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_ADD_ITEM_INGREDIENTS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_ITEM_INGREDIENT_PARAMS {
  body: {
    quantity?: number;
    quantity_type_id?: number;
  };

  path: {
    item_id: number;
    ingredient_id: number;
  };
}
export interface CONFIG_UPDATE_ITEM_INGREDIENT_RESPONSE_200 {
  message: string;
}
export interface CONFIG_UPDATE_ITEM_INGREDIENT_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_ITEM_INGREDIENT_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REMOVE_ITEM_INGREDIENTS_PARAMS {
  body: {
    ingredient_ids: number[];
  };

  path: {
    item_id: number;
  };
}
export interface CONFIG_REMOVE_ITEM_INGREDIENTS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REMOVE_ITEM_INGREDIENTS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REMOVE_ITEM_INGREDIENTS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_AREAS_LIST_PARAMS {

  query: {
    area_type?: string;
    is_active?: boolean;
    has_items?: boolean;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_AREAS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    area_type: string;
    description: string;
    display_order: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_AREAS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_AREA_PARAMS {
  body: {
    name: string;
    area_type: string;
    description?: string;
    display_order?: number;
  };


}
export interface CONFIG_CREATE_AREA_RESPONSE_200 {
  id: number;
  name: string;
  area_type: string;
  is_active: boolean;
}
export interface CONFIG_CREATE_AREA_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_AREA_DETAIL_PARAMS {


  path: {
    area_id: number;
  };
}
export interface CONFIG_GET_AREA_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  area_type: string;
  description: string;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_GET_AREA_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_AREA_PARAMS {
  body: {
    name: string;
    area_type: string;
    description?: string;
    display_order?: number;
  };

  path: {
    area_id: number;
  };
}
export interface CONFIG_UPDATE_AREA_RESPONSE_200 {
  id: number;
  name: string;
  area_type: string;
  is_active: boolean;
}
export interface CONFIG_UPDATE_AREA_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_AREA_PARAMS {
  body: {
    name?: string;
    area_type?: string;
    description?: string;
    display_order?: number;
  };

  path: {
    area_id: number;
  };
}
export interface CONFIG_PATCH_AREA_RESPONSE_200 {
  id: number;
  name: string;
  area_type: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_AREA_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_AREA_PARAMS {


  path: {
    area_id: number;
  };
}
export interface CONFIG_DELETE_AREA_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_AREA_PARAMS {
  body: {
    reactivate_items?: boolean;
  };

  path: {
    area_id: number;
  };
}
export interface CONFIG_ACTIVATE_AREA_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ACTIVATE_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_AREA_PARAMS {


  path: {
    area_id: number;
  };
}
export interface CONFIG_DEACTIVATE_AREA_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DEACTIVATE_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REORDER_AREA_PARAMS {
  body: {
    new_order: number;
  };

  path: {
    area_id: number;
  };
}
export interface CONFIG_REORDER_AREA_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REORDER_AREA_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REORDER_AREA_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_AREA_ITEMS_PARAMS {

  query: {
    is_active?: boolean;
  };
  path: {
    area_id: number;
  };
}
export interface CONFIG_GET_AREA_ITEMS_RESPONSE_200 {
  results: {
    id: number;
    name: string;
    price: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_AREA_ITEMS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_AREA_TABLES_PARAMS {

  query: {
    status?: string;
    is_active?: boolean;
    min_capacity?: number;
  };
  path: {
    area_id: number;
  };
}
export interface CONFIG_GET_AREA_TABLES_RESPONSE_200 {
  results: {
    id: number;
    table_number: string;
    capacity: number;
    status: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_AREA_TABLES_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_TABLES_LIST_PARAMS {

  query: {
    is_active?: boolean;
    search?: string;
  };

}
export interface CONFIG_GET_TABLES_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    table_number: string;
    capacity: number;
    table_area: number;
    status: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_TABLES_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_TABLE_PARAMS {
  body: {
    table_number: string;
    capacity: number;
    table_area: number;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_TABLE_RESPONSE_200 {
  id: number;
  table_number: string;
  capacity: number;
  table_area: number;
  is_active: boolean;
}
export interface CONFIG_CREATE_TABLE_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_TABLE_DETAIL_PARAMS {


  path: {
    table_id: number;
  };
}
export interface CONFIG_GET_TABLE_DETAIL_RESPONSE_200 {
  id: number;
  table_number: string;
  capacity: number;
  table_area: number;
  status: string;
  is_active: boolean;
}
export interface CONFIG_GET_TABLE_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_TABLE_PARAMS {
  body: {
    table_number: string;
    capacity: number;
    table_area: number;
    is_active: boolean;
  };

  path: {
    table_id: number;
  };
}
export interface CONFIG_UPDATE_TABLE_RESPONSE_200 {
  id: number;
  table_number: string;
  capacity: number;
  table_area: number;
  is_active: boolean;
}
export interface CONFIG_UPDATE_TABLE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_TABLE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_TABLE_PARAMS {
  body: {
    table_number?: string;
    capacity?: number;
    table_area?: number;
    is_active?: boolean;
  };

  path: {
    table_id: number;
  };
}
export interface CONFIG_PATCH_TABLE_RESPONSE_200 {
  id: number;
  table_number: string;
  capacity: number;
  is_active: boolean;
}
export interface CONFIG_PATCH_TABLE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_TABLE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_TABLE_PARAMS {


  path: {
    table_id: number;
  };
}
export interface CONFIG_DELETE_TABLE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_TABLE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_TABLE_PARAMS {


  path: {
    table_id: number;
  };
}
export interface CONFIG_ACTIVATE_TABLE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ACTIVATE_TABLE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_TABLE_PARAMS {


  path: {
    table_id: number;
  };
}
export interface CONFIG_DEACTIVATE_TABLE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DEACTIVATE_TABLE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_CHANGE_TABLE_STATUS_PARAMS {
  body: {
    status: string;
  };

  path: {
    table_id: number;
  };
}
export interface CONFIG_CHANGE_TABLE_STATUS_RESPONSE_200 {
  message: string;
}
export interface CONFIG_CHANGE_TABLE_STATUS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_CHANGE_TABLE_STATUS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_TABLES_BY_AREA_PARAMS {

  query: {
    area_id: number;
  };

}
export interface CONFIG_GET_TABLES_BY_AREA_RESPONSE_200 {
  results: {
    id: number;
    table_number: string;
    capacity: number;
    status: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_TABLES_BY_AREA_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_TABLES_STATS_PARAMS {



}
export interface CONFIG_GET_TABLES_STATS_RESPONSE_200 {
  total: number;
  active: number;
  inactive: number;
  available: number;
  occupied: number;
  reserved: number;
}
export interface CONFIG_GET_TABLES_STATS_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_GET_OPTION_GROUPS_LIST_PARAMS {

  query: {
    is_active?: boolean;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_OPTION_GROUPS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    display_order: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_OPTION_GROUPS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_OPTION_GROUP_PARAMS {
  body: {
    name: string;
    display_order?: number;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_OPTION_GROUP_RESPONSE_200 {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_CREATE_OPTION_GROUP_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_OPTION_GROUP_DETAIL_PARAMS {


  path: {
    option_group_id: number;
  };
}
export interface CONFIG_GET_OPTION_GROUP_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_GET_OPTION_GROUP_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_OPTION_GROUP_PARAMS {
  body: {
    name: string;
    display_order: number;
    is_active: boolean;
  };

  path: {
    option_group_id: number;
  };
}
export interface CONFIG_UPDATE_OPTION_GROUP_RESPONSE_200 {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_UPDATE_OPTION_GROUP_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_OPTION_GROUP_PARAMS {
  body: {
    name?: string;
    display_order?: number;
    is_active?: boolean;
  };

  path: {
    option_group_id: number;
  };
}
export interface CONFIG_PATCH_OPTION_GROUP_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_OPTION_GROUP_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_OPTION_GROUP_PARAMS {


  path: {
    option_group_id: number;
  };
}
export interface CONFIG_DELETE_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_OPTION_GROUP_PARAMS {


  path: {
    option_group_id: number;
  };
}
export interface CONFIG_ACTIVATE_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_ACTIVATE_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_OPTION_GROUP_PARAMS {


  path: {
    option_group_id: number;
  };
}
export interface CONFIG_DEACTIVATE_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DEACTIVATE_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REORDER_OPTION_GROUP_PARAMS {
  body: {
    new_order: number;
  };

  path: {
    option_group_id: number;
  };
}
export interface CONFIG_REORDER_OPTION_GROUP_RESPONSE_200 {
  message: string;
}
export interface CONFIG_REORDER_OPTION_GROUP_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REORDER_OPTION_GROUP_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_OPTION_GROUP_OPTIONS_PARAMS {

  query: {
    is_active?: boolean;
    ordering?: string;
  };
  path: {
    option_group_id: number;
  };
}
export interface CONFIG_GET_OPTION_GROUP_OPTIONS_RESPONSE_200 {
  results: {
    id: number;
    name: string;
    additional_amount: number;
    display_order: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_OPTION_GROUP_OPTIONS_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_OPTIONS_LIST_PARAMS {

  query: {
    parent_group?: number;
    is_active?: boolean;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_OPTIONS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    parent_group: number;
    additional_amount: number;
    display_order: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_OPTIONS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_OPTION_PARAMS {
  body: {
    parent_group: number;
    name: string;
    additional_amount: number;
    display_order?: number;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_OPTION_RESPONSE_200 {
  id: number;
  parent_group: number;
  name: string;
  additional_amount: number;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_CREATE_OPTION_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_OPTION_DETAIL_PARAMS {


  path: {
    option_id: number;
  };
}
export interface CONFIG_GET_OPTION_DETAIL_RESPONSE_200 {
  id: number;
  parent_group: number;
  name: string;
  additional_amount: number;
  display_order?: number;
  is_active: boolean;
}
export interface CONFIG_GET_OPTION_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_OPTION_PARAMS {
  body: {
    parent_group: number;
    name: string;
    additional_amount: number;
    display_order: number;
    is_active: boolean;
  };

  path: {
    option_id: number;
  };
}
export interface CONFIG_UPDATE_OPTION_RESPONSE_200 {
  id: number;
  parent_group: number;
  name: string;
  additional_amount: number;
  display_order: number;
  is_active: boolean;
}
export interface CONFIG_UPDATE_OPTION_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_OPTION_PARAMS {
  body: {
    name?: string;
    additional_amount?: number;
    display_order?: number;
    is_active?: boolean;
  };

  path: {
    option_id: number;
  };
}
export interface CONFIG_PATCH_OPTION_RESPONSE_200 {
  id: number;
  name: string;
  additional_amount: number;
  is_active: boolean;
}
export interface CONFIG_PATCH_OPTION_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_OPTION_PARAMS {


  path: {
    option_id: number;
  };
}
export interface CONFIG_DELETE_OPTION_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_OPTION_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_OPTION_PARAMS {


  path: {
    option_id: number;
  };
}
export interface CONFIG_ACTIVATE_OPTION_RESPONSE_200 {
  message: string;
  id: number;
  is_active: boolean;
}
export interface CONFIG_ACTIVATE_OPTION_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_OPTION_PARAMS {


  path: {
    option_id: number;
  };
}
export interface CONFIG_DEACTIVATE_OPTION_RESPONSE_200 {
  message: string;
  id: number;
  is_active: boolean;
}
export interface CONFIG_DEACTIVATE_OPTION_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REORDER_OPTION_PARAMS {
  body: {
    new_order: number;
  };

  path: {
    option_id: number;
  };
}
export interface CONFIG_REORDER_OPTION_RESPONSE_200 {
  message: string;
  id: number;
  display_order: number;
}
export interface CONFIG_REORDER_OPTION_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_INGREDIENTS_LIST_PARAMS {

  query: {
    search?: string;
    is_active?: boolean;
  };

}
export interface CONFIG_GET_INGREDIENTS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_INGREDIENTS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_INGREDIENT_PARAMS {
  body: {
    name: string;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_INGREDIENT_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_CREATE_INGREDIENT_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_INGREDIENT_DETAIL_PARAMS {


  path: {
    ingredient_id: number;
  };
}
export interface CONFIG_GET_INGREDIENT_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_GET_INGREDIENT_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_INGREDIENT_PARAMS {
  body: {
    name: string;
    is_active: boolean;
  };

  path: {
    ingredient_id: number;
  };
}
export interface CONFIG_UPDATE_INGREDIENT_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_UPDATE_INGREDIENT_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_INGREDIENT_PARAMS {
  body: {
    name?: string;
    is_active?: boolean;
  };

  path: {
    ingredient_id: number;
  };
}
export interface CONFIG_PATCH_INGREDIENT_RESPONSE_200 {
  id: number;
  name: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_INGREDIENT_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_INGREDIENT_PARAMS {


  path: {
    ingredient_id: number;
  };
}
export interface CONFIG_DELETE_INGREDIENT_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_INGREDIENT_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_QUANTITY_TYPES_LIST_PARAMS {

  query: {
    search?: string;
    is_active?: boolean;
  };

}
export interface CONFIG_GET_QUANTITY_TYPES_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    abbreviation: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_QUANTITY_TYPES_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_QUANTITY_TYPE_PARAMS {
  body: {
    name: string;
    abbreviation: string;
    is_active: boolean;
  };


}
export interface CONFIG_CREATE_QUANTITY_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  abbreviation: string;
  is_active: boolean;
}
export interface CONFIG_CREATE_QUANTITY_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_QUANTITY_TYPE_DETAIL_PARAMS {


  path: {
    quantity_type_id: number;
  };
}
export interface CONFIG_GET_QUANTITY_TYPE_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  abbreviation: string;
  is_active: boolean;
}
export interface CONFIG_GET_QUANTITY_TYPE_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_QUANTITY_TYPE_PARAMS {
  body: {
    name: string;
    abbreviation: string;
    is_active: boolean;
  };

  path: {
    quantity_type_id: number;
  };
}
export interface CONFIG_UPDATE_QUANTITY_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  abbreviation: string;
  is_active: boolean;
}
export interface CONFIG_UPDATE_QUANTITY_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_QUANTITY_TYPE_PARAMS {
  body: {
    name?: string;
    abbreviation?: string;
    is_active?: boolean;
  };

  path: {
    quantity_type_id: number;
  };
}
export interface CONFIG_PATCH_QUANTITY_TYPE_RESPONSE_200 {
  id: number;
  name: string;
  abbreviation: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_QUANTITY_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_QUANTITY_TYPE_PARAMS {


  path: {
    quantity_type_id: number;
  };
}
export interface CONFIG_DELETE_QUANTITY_TYPE_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_QUANTITY_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIGS_LIST_PARAMS {

  query: {
    data_type?: string;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_DYNAMIC_CONFIGS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    key: string;
    value: string;
    data_type: string;
    description?: string;
  }[];
}
export interface CONFIG_GET_DYNAMIC_CONFIGS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_DYNAMIC_CONFIG_PARAMS {
  body: {
    key: string;
    value: string;
    data_type: string;
    description?: string;
  };


}
export interface CONFIG_CREATE_DYNAMIC_CONFIG_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
  description?: string;
}
export interface CONFIG_CREATE_DYNAMIC_CONFIG_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIG_DETAIL_PARAMS {


  path: {
    config_id: number;
  };
}
export interface CONFIG_GET_DYNAMIC_CONFIG_DETAIL_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
  description?: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIG_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_PARAMS {
  body: {
    key: string;
    value: string;
    data_type: string;
    description?: string;
  };

  path: {
    config_id: number;
  };
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
  description?: string;
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_DYNAMIC_CONFIG_PARAMS {
  body: {
    value?: string;
    description?: string;
  };

  path: {
    config_id: number;
  };
}
export interface CONFIG_PATCH_DYNAMIC_CONFIG_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
}
export interface CONFIG_PATCH_DYNAMIC_CONFIG_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_PARAMS {


  path: {
    config_id: number;
  };
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIG_BY_KEY_PARAMS {


  path: {
    config_key: string;
  };
}
export interface CONFIG_GET_DYNAMIC_CONFIG_BY_KEY_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
  description?: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIG_BY_KEY_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_BY_KEY_PARAMS {
  body: {
    value: string;
  };

  path: {
    config_key: string;
  };
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_BY_KEY_RESPONSE_200 {
  id: number;
  key: string;
  value: string;
  data_type: string;
}
export interface CONFIG_UPDATE_DYNAMIC_CONFIG_BY_KEY_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_BY_KEY_PARAMS {


  path: {
    config_key: string;
  };
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_BY_KEY_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_DYNAMIC_CONFIG_BY_KEY_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_DYNAMIC_CONFIGS_BY_TYPE_PARAMS {


  path: {
    data_type: string;
  };
}
export interface CONFIG_GET_DYNAMIC_CONFIGS_BY_TYPE_RESPONSE_200 {
  count: number;
  results: {
    id: number;
    key: string;
    value: string;
    data_type: string;
  }[];
}
export interface CONFIG_GET_DYNAMIC_CONFIGS_BY_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_INGREDIENT_TYPES_LIST_PARAMS {

  query: {
    search?: string;
    is_active?: boolean;
    ordering?: string;
  };

}
export interface CONFIG_GET_INGREDIENT_TYPES_LIST_RESPONSE_200 {
  status: string;
  message: string;
  data: {
    ingredient_types: {
      id: string;
      name: string;
      description: string;
      display_order: number;
      is_active: boolean;
    }[];
    count: number;
  };
}
export interface CONFIG_GET_INGREDIENT_TYPES_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_INGREDIENT_TYPE_PARAMS {
  body: {
    name: string;
    description?: string;
    display_order?: number;
  };


}
export interface CONFIG_CREATE_INGREDIENT_TYPE_RESPONSE_200 {
  status: string;
  message: string;
  data: {
    ingredient_type: {
      id: string;
      name: string;
    };
  };
}
export interface CONFIG_CREATE_INGREDIENT_TYPE_RESPONSE_400 {
  error: string;
  code: string;
}
export interface CONFIG_GET_INGREDIENT_TYPE_DETAIL_PARAMS {


  path: {
    ingredient_type_id: string;
  };
}
export interface CONFIG_GET_INGREDIENT_TYPE_DETAIL_RESPONSE_200 {
  status: string;
  data: {
    ingredient_type: {
      id: string;
      name: string;
      description: string;
      display_order: number;
      is_active: boolean;
    };
  };
}
export interface CONFIG_GET_INGREDIENT_TYPE_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_INGREDIENT_TYPE_PARAMS {
  body: {
    name: string;
    description?: string;
    display_order?: number;
  };

  path: {
    ingredient_type_id: string;
  };
}
export interface CONFIG_UPDATE_INGREDIENT_TYPE_RESPONSE_200 {
  status: string;
  message: string;
}
export interface CONFIG_UPDATE_INGREDIENT_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_UPDATE_INGREDIENT_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_INGREDIENT_TYPE_PARAMS {
  body: {
    name?: string;
    description?: string;
    display_order?: number;
  };

  path: {
    ingredient_type_id: string;
  };
}
export interface CONFIG_PATCH_INGREDIENT_TYPE_RESPONSE_200 {
  status: string;
  message: string;
}
export interface CONFIG_PATCH_INGREDIENT_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_INGREDIENT_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_INGREDIENT_TYPE_PARAMS {


  path: {
    ingredient_type_id: string;
  };
}
export interface CONFIG_DELETE_INGREDIENT_TYPE_RESPONSE_200 {
  status: string;
  message: string;
}
export interface CONFIG_DELETE_INGREDIENT_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_INGREDIENT_TYPES_STATS_PARAMS {



}
export interface CONFIG_GET_INGREDIENT_TYPES_STATS_RESPONSE_200 {
  status: string;
  data: {
    total_types: number;
    types_actifs: number;
    types_inactifs: number;
  };
}
export interface CONFIG_GET_INGREDIENT_TYPES_STATS_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_REORDER_INGREDIENT_TYPE_PARAMS {
  body: {
    new_order: number;
  };

  path: {
    ingredient_type_id: string;
  };
}
export interface CONFIG_REORDER_INGREDIENT_TYPE_RESPONSE_200 {
  status: string;
  message: string;
}
export interface CONFIG_REORDER_INGREDIENT_TYPE_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REORDER_INGREDIENT_TYPE_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_KITCHENS_LIST_PARAMS {

  query: {
    is_active?: boolean;
    area?: string;
    responsable_id?: string;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_KITCHENS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    area: string;
    area_name: string;
    responsable_id: string;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_KITCHENS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_KITCHEN_PARAMS {
  body: {
    name: string;
    description?: string;
    icon?: string;
    area?: string;
    responsable_id?: string;
  };


}
export interface CONFIG_CREATE_KITCHEN_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_CREATE_KITCHEN_RESPONSE_400 {
  detail: string;
}
export interface CONFIG_GET_KITCHEN_DETAIL_PARAMS {


  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_GET_KITCHEN_DETAIL_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_GET_KITCHEN_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_KITCHEN_PARAMS {
  body: {
    name: string;
    description?: string;
    icon?: string;
    area?: string;
    responsable_id?: string;
  };

  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_UPDATE_KITCHEN_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_UPDATE_KITCHEN_RESPONSE_400 {
  detail: string;
}
export interface CONFIG_UPDATE_KITCHEN_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_PATCH_KITCHEN_PARAMS {
  body: {
    name?: string;
    description?: string;
    icon?: string;
    area?: string;
    responsable_id?: string;
  };

  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_PATCH_KITCHEN_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_PATCH_KITCHEN_RESPONSE_400 {
  detail: string;
}
export interface CONFIG_PATCH_KITCHEN_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DELETE_KITCHEN_PARAMS {


  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_DELETE_KITCHEN_RESPONSE_200 {
  detail: string;
}
export interface CONFIG_DELETE_KITCHEN_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_KITCHEN_PARAMS {


  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_ACTIVATE_KITCHEN_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_ACTIVATE_KITCHEN_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_KITCHEN_PARAMS {


  path: {
    kitchen_id: string;
  };
}
export interface CONFIG_DEACTIVATE_KITCHEN_RESPONSE_200 {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  area: string;
  area_name: string;
  responsable_id: string;
  is_active: boolean;
}
export interface CONFIG_DEACTIVATE_KITCHEN_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_KITCHENS_STATS_RESPONSE_200 {
  total: number;
  active: number;
  inactive: number;
}
export interface CONFIG_GET_KITCHENS_STATS_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_GET_KITCHENS_BY_AREA_PARAMS {



}
export interface CONFIG_GET_KITCHENS_BY_AREA_RESPONSE_200 {
  status: string;
  message: string;
  data: {
    zones: {
      id: string;
      name: string;
      kitchens: {
        id: string;
        name: string;
        slug: string;
        is_active: boolean;
      }[];
      total_kitchens: number;
    }[];
  };
}
export interface CONFIG_GET_SET_MENUS_LIST_PARAMS {

  query: {
    is_active?: boolean;
    search?: string;
    ordering?: string;
  };

}
export interface CONFIG_GET_SET_MENUS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    name: string;
    description?: string;
    price: number;
    display_order?: number;
    is_active: boolean;
  }[];
}
export interface CONFIG_GET_SET_MENUS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_SET_MENU_PARAMS {
  body: {
    name: string;
    description?: string;
    price: number;
    display_order?: number;
    sections?: {
      category_id: number;
      name?: string;
      min_selections?: number;
      max_selections: number;
      display_order?: number;
      item_ids: number[];
    }[];
  };


}
export interface CONFIG_CREATE_SET_MENU_RESPONSE_200 {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
}
export interface CONFIG_CREATE_SET_MENU_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_SET_MENU_DETAIL_PARAMS {


  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_GET_SET_MENU_DETAIL_RESPONSE_200 {
  id: number;
  name: string;
  description?: string;
  price: number;
  display_order?: number;
  is_active: boolean;
}
export interface CONFIG_GET_SET_MENU_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_SET_MENU_PARAMS {
  body: {
    name: string;
    description?: string;
    price: number;
    display_order: number;
    is_active: boolean;
  };

  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_UPDATE_SET_MENU_RESPONSE_200 {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
}
export interface CONFIG_UPDATE_SET_MENU_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_SET_MENU_PARAMS {
  body: {
    name?: string;
    description?: string;
    price?: number;
    display_order?: number;
    is_active?: boolean;
  };

  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_PATCH_SET_MENU_RESPONSE_200 {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
}
export interface CONFIG_PATCH_SET_MENU_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_SET_MENU_PARAMS {


  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_DELETE_SET_MENU_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_SET_MENU_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ACTIVATE_SET_MENU_PARAMS {


  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_ACTIVATE_SET_MENU_RESPONSE_200 {
  message: string;
  id: number;
  is_active: boolean;
}
export interface CONFIG_ACTIVATE_SET_MENU_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_DEACTIVATE_SET_MENU_PARAMS {


  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_DEACTIVATE_SET_MENU_RESPONSE_200 {
  message: string;
  id: number;
  is_active: boolean;
}
export interface CONFIG_DEACTIVATE_SET_MENU_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_REORDER_SET_MENU_PARAMS {
  body: {
    new_order: number;
  };

  path: {
    set_menu_id: number;
  };
}
export interface CONFIG_REORDER_SET_MENU_RESPONSE_200 {
  message: string;
  id: number;
  display_order: number;
}
export interface CONFIG_REORDER_SET_MENU_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_GET_SET_MENU_SECTIONS_LIST_PARAMS {

  query: {
    set_menu?: number;
    category?: number;
  };

}
export interface CONFIG_GET_SET_MENU_SECTIONS_LIST_RESPONSE_200 {
  count: number;
  next: string;
  previous: string;
  results: {
    id: number;
    set_menu: number;
    category_id: number;
    max_selections: number;
  }[];
}
export interface CONFIG_GET_SET_MENU_SECTIONS_LIST_RESPONSE_401 {
  detail: string;
}
export interface CONFIG_CREATE_SET_MENU_SECTION_PARAMS {
  body: {
    set_menu: number;
    category_id: number;
    max_selections: number;
    item_ids: number[];
  };


}
export interface CONFIG_CREATE_SET_MENU_SECTION_RESPONSE_200 {
  id: number;
  set_menu: number;
  category_id: number;
  max_selections: number;
}
export interface CONFIG_CREATE_SET_MENU_SECTION_RESPONSE_400 {
  error: string;
}
export interface CONFIG_GET_SET_MENU_SECTION_DETAIL_PARAMS {


  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_GET_SET_MENU_SECTION_DETAIL_RESPONSE_200 {
  id: number;
  set_menu: number;
  category_id: number;
  max_selections: number;
}
export interface CONFIG_GET_SET_MENU_SECTION_DETAIL_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_UPDATE_SET_MENU_SECTION_PARAMS {
  body: {
    set_menu: number;
    category_id: number;
    max_selections: number;
    item_ids: number[];
  };

  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_UPDATE_SET_MENU_SECTION_RESPONSE_200 {
  id: number;
  set_menu: number;
  category_id: number;
  max_selections: number;
}
export interface CONFIG_UPDATE_SET_MENU_SECTION_RESPONSE_400 {
  error: string;
}
export interface CONFIG_PATCH_SET_MENU_SECTION_PARAMS {
  body: {
    max_selections?: number;
    category_id?: number;
  };

  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_PATCH_SET_MENU_SECTION_RESPONSE_200 {
  id: number;
  set_menu: number;
  category_id: number;
  max_selections: number;
}
export interface CONFIG_PATCH_SET_MENU_SECTION_RESPONSE_400 {
  error: string;
}
export interface CONFIG_DELETE_SET_MENU_SECTION_PARAMS {


  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_DELETE_SET_MENU_SECTION_RESPONSE_200 {
  message: string;
}
export interface CONFIG_DELETE_SET_MENU_SECTION_RESPONSE_404 {
  detail: string;
}
export interface CONFIG_ADD_SET_MENU_SECTION_ITEMS_PARAMS {
  body: {
    item_ids: number[];
  };

  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_ADD_SET_MENU_SECTION_ITEMS_RESPONSE_200 {
  message: string;
  id: number;
}
export interface CONFIG_ADD_SET_MENU_SECTION_ITEMS_RESPONSE_400 {
  error: string;
}
export interface CONFIG_REMOVE_SET_MENU_SECTION_ITEMS_PARAMS {
  body: {
    item_ids: number[];
  };

  path: {
    set_menu_section_id: number;
  };
}
export interface CONFIG_REMOVE_SET_MENU_SECTION_ITEMS_RESPONSE_200 {
  message: string;
  id: number;
}
export interface CONFIG_REMOVE_SET_MENU_SECTION_ITEMS_RESPONSE_400 {
  error: string;
}
