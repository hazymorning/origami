# Writes scenarios with every option of the modules, alone and in the pairs that interact, for compare.mjs. They show far more
# cases than a dashboard does, so a cleanup that changes nothing can prove it on all of them.
#
#   python3 .github/bench/options.py <folder>
#   node .github/bench/compare.mjs <folder>/options-*.yaml
import copy, os, sys
import yaml
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
sheet = yaml.safe_load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sheet.yaml')))
states = copy.deepcopy(sheet['states'])
states.update({
  'input_select.lamp_view': {'state': 'Brightness', 'attributes': {'friendly_name': 'Lamp view', 'options': ['Brightness', 'Color', 'Scenes']}},
  'input_select.speaker': {'state': 'media_player.living_room', 'attributes': {'friendly_name': 'Speaker', 'options': ['media_player.living_room', 'media_player.kitchen_speaker']}},
  'light.desk': {'state': 'off', 'attributes': {'friendly_name': 'Desk', 'supported_color_modes': ['brightness'], 'brightness': None}},
  'light.hall': {'state': 'on', 'attributes': {'friendly_name': 'Hall with a long name for the tiles', 'brightness': 90, 'supported_color_modes': ['brightness'], 'color_mode': 'brightness'}},
  'scene.evening': {'state': '2026-10-28T19:00:00+00:00', 'attributes': {'friendly_name': 'Evening'}},
  'script.movie': {'state': 'off', 'attributes': {'friendly_name': 'Movie'}},
  'cover.blinds': {'state': 'open', 'attributes': {'friendly_name': 'Blinds', 'current_position': 60}},
  'binary_sensor.door': {'state': 'unavailable', 'attributes': {'friendly_name': 'Door', 'device_class': 'door'}},
  'input_boolean.guest': {'state': 'on', 'attributes': {'friendly_name': 'Guest mode'}},
  'number.volume': {'state': '35', 'attributes': {'friendly_name': 'Volume', 'min': 0, 'max': 100, 'step': 1}},
})
def scenario(name, cards, extra=None):
    d = {'width': 411, 'states': states, 'sections': [{'id': name, 'cards': cards}]}
    d.update(extra or {})
    yaml.safe_dump(d, open(f'{out}/options-{name}.yaml', 'w'), allow_unicode=True, sort_keys=False)
sel = lambda opt: {'action': 'perform-action', 'perform_action': 'input_select.select_option', 'target': {'entity_id': 'input_select.lamp_view'}, 'data': {'option': opt}}

# Header
values = [
  {'name': 'Temperature', 'entity': 'sensor.living_room_temperature', 'icon': 'mdi:thermometer', 'show_state': True},
  {'entity': 'sensor.living_room_humidity', 'icon': 'mdi:water', 'show_state': True},
  {'icon': 'mdi:cog', 'tap_action': {'action': 'navigate', 'navigation_path': '#settings'}},
  {'name': 'Brightness', 'icon': 'mdi:brightness-5', 'tap_action': sel('Brightness')},
  {'name': 'Color', 'icon': 'mdi:palette-outline', 'tap_action': sel('Color'), 'origami_header': {'name': 'Colour'}},
]
opts = [{}, {'weight': 'regular'}, {'weight': 'medium'}, {'icon_color': 'var(--orange-color)'}, {'icon_size': 'var(--icon-size-l)'},
        {'value_size': 'var(--ha-font-size-s)'}, {'icon_gap': 'var(--ha-space-3)'}, {'value_max_width': '120px'}, {'size': 'large'},
        {'title_action': True}, {'scroll': True}, {'value_position': 'above'}]
styles = [None, 'chip', 'switch']
cards = []
for st in styles:
    for o in opts:
        for o2 in ([{}] + [x for x in opts if x and list(x)[0] in ('scroll', 'value_position', 'value_max_width', 'size', 'title_action') and x != o] if list(o)[:1] in (['scroll'], ['value_position'], ['value_max_width'], ['size']) or not o else [{}]):
            h = {**o, **o2}
            if st: h['value_style'] = st
            cards.append({'type': 'custom:bubble-card', 'card_type': 'separator', 'name': 'Title ' + ' '.join(f'{k}={v}' for k, v in h.items())[:40], 'modules': ['origami_header'], 'origami_header': h, 'sub_button': {'main': copy.deepcopy(values)}})
scenario('header', cards)


# Button on a sub-buttons card and on a button card
row = [
  {'name': 'Brightness', 'icon': 'mdi:brightness-5', 'tap_action': sel('Brightness')},
  {'name': 'Color', 'icon': 'mdi:palette-outline', 'tap_action': sel('Color')},
  {'name': 'Scenes', 'icon': 'mdi:palette', 'tap_action': sel('Scenes'), 'content_layout': 'icon-right'},
  {'icon': 'mdi:power', 'entity': 'light.kitchen', 'tap_action': {'action': 'toggle'}},
  {'name': 'Guest', 'entity': 'input_boolean.guest', 'icon': 'mdi:account', 'tap_action': {'action': 'toggle'}, 'content_layout': 'icon-top'},
  {'css_class': 'divider'},
  {'name': 'Movie', 'entity': 'script.movie', 'icon': 'mdi:movie', 'tap_action': {'action': 'perform-action', 'perform_action': 'script.turn_on', 'target': {'entity_id': 'script.movie'}}},
]
grouped = [{'name': 'View', 'group': copy.deepcopy(row[:3])}, {'name': 'More', 'group': copy.deepcopy(row[3:])}]
bopts = [{}, {'background': False}, {'align': 'center'}, {'align': 'end'}, {'columns': 3}, {'muted': True}, {'icon_size': 'var(--icon-size-s)'},
         {'padding': 'var(--ha-space-2)'}, {'active': 'Color'}, {'color': 'var(--orange-color)'}, {'active_style': 'toggle'}, {'segmented': True},
         {'segmented': ['View']}, {'chips': True}, {'labels': 'below'}, {'labels': 'below', 'field_size': '64px'}, {'outline': 'Scenes'},
         {'start': 'Color'}, {'pending': True}, {'label_size': 'normal', 'segmented': True}, {'scroll': True}, {'press': False}]
pairs = [{'chips': True, 'scroll': True}, {'chips': True, 'labels': 'below'}, {'labels': 'below', 'columns': 3}, {'labels': 'below', 'scroll': True},
         {'segmented': True, 'scroll': True}, {'segmented': ['View'], 'scroll': True}, {'active_style': 'toggle', 'chips': True}, {'background': False, 'chips': True},
         {'columns': 3, 'align': 'center'}, {'background': False, 'labels': 'below'}, {'muted': True, 'segmented': True}, {'chips': True, 'columns': 2},
         {'active_style': 'toggle', 'labels': 'below'}, {'outline': 'Scenes', 'labels': 'below'}, {'scroll': True, 'align': 'end'}]
cards = []
for o in bopts + pairs:
    for layout, card_type in ((grouped, 'sub-buttons'), (copy.deepcopy(row), 'sub-buttons'), (grouped, 'button')):
        c = {'type': 'custom:bubble-card', 'card_type': card_type, 'modules': ['origami_button'], 'origami_button': o, 'sub_button': {'main': [], 'bottom': copy.deepcopy(layout)}}
        if card_type == 'button':
            c.update({'entity': 'light.kitchen', 'button_type': 'switch', 'rows': 'auto', 'modules': ['origami_base', 'origami_button']})
            c['sub_button']['main'] = [{'icon': 'mdi:cog'}]
            c['sub_button']['bottom_layout'] = 'rows'
        cards.append(c)
scenario('button', cards)


# Tiles
tiles = [
  {'entity': 'light.kitchen', 'icon': 'mdi:lightbulb', 'tap_action': {'action': 'toggle'}},
  {'entity': 'light.desk', 'icon': 'mdi:desk-lamp', 'tap_action': {'action': 'more-info'}},
  {'entity': 'light.hall', 'icon': 'mdi:lightbulb-group', 'state_content': ['state', 'brightness']},
  {'entity': 'scene.evening', 'icon': 'mdi:weather-night', 'tap_action': {'action': 'perform-action', 'perform_action': 'scene.turn_on', 'target': {'entity_id': 'scene.evening'}}},
  {'entity': 'script.movie', 'icon': 'mdi:movie', 'tap_action': {'action': 'perform-action', 'perform_action': 'script.toggle', 'target': {'entity_id': 'script.movie'}}},
  {'entity': 'cover.blinds', 'icon': 'mdi:blinds', 'tap_action': {'action': 'navigate', 'navigation_path': '#blinds'}, 'origami_tiles': {'color': 'var(--cyan-color)', 'state_color': 'var(--cyan-color)'}},
  {'entity': 'binary_sensor.door', 'icon': 'mdi:door'},
  {'name': 'No icon', 'entity': 'input_boolean.guest', 'show_icon': False, 'origami_tiles': {'name': 'Guests', 'state': 'Two', 'order': 1}},
  {'entity': 'sensor.living_room_temperature', 'icon': 'mdi:thermometer', 'origami_tiles': {'sign': 'none', 'name_color': 'var(--red-color)'}},
]
topts = [{}, {'columns': 3}, {'columns': 1}, {'layout': 'list'}, {'layout': 'list', 'slim': True}, {'layout': 'list', 'dividers': True},
         {'layout': 'list', 'slim': True, 'dividers': True}, {'layout': 'list', 'sign': 'open'}, {'layout': 'list', 'sign': 'none'}, {'layout': 'list', 'slim': True, 'sign': 'switch'}]
cards = []
for o in topts:
    for layout in (copy.deepcopy(tiles), [{'group': copy.deepcopy(tiles[:4])}, {'group': copy.deepcopy(tiles[4:])}]):
        cards.append({'type': 'custom:bubble-card', 'card_type': 'sub-buttons', 'modules': ['origami_tiles'], 'origami_tiles': o, 'sub_button': {'main': [], 'bottom': layout}})
scenario('tiles', cards)


# Base on button cards
keys = [{'icon': 'mdi:minus', 'show_background': True}, {'entity': 'light.kitchen', 'icon': 'mdi:power', 'show_background': True, 'tap_action': {'action': 'toggle'}},
        {'entity': 'input_select.speaker', 'show_background': True}, {'icon': 'mdi:plus', 'show_background': False, 'css_class': 'accent'}]
slider = [{'entity': 'light.kitchen', 'sub_button_type': 'slider', 'always_visible': True}]
reading = [{'icon': 'mdi:minus', 'show_background': True}, {'entity': 'climate.bedroom', 'css_class': 'readout', 'show_background': False}, {'icon': 'mdi:plus', 'show_background': True}]
bao = [{}, {'compact': True}, {'toggle': True}, {'group': True}, {'tile': True}, {'frameless': True}, {'vertical': True}, {'large': True}, {'padding': 'var(--ha-space-2)'},
       {'sub_button_height': '32px'}, {'sub_button_text_size': 'var(--ha-font-size-m)'}, {'compact': True, 'group': True}, {'compact': True, 'tile': True},
       {'tile': True, 'group': True}, {'vertical': True, 'tile': True}, {'frameless': True, 'large': True}, {'toggle': True, 'compact': True}, {'toggle': True, 'group': True},
       {'large': True, 'group': True}, {'frameless': True, 'group': True}, {'vertical': True, 'large': True}, {'compact': True, 'large': True}]
cards = []
for o in bao:
    for main, entity in ((keys, 'light.kitchen'), (slider, 'light.kitchen'), (reading, 'climate.bedroom'), ([], 'switch.printer')):
        c = {'type': 'custom:bubble-card', 'card_type': 'button', 'button_type': 'switch', 'entity': entity, 'modules': ['origami_base'], 'origami_base': o, 'sub_button': {'main': copy.deepcopy(main)}}
        if main is keys: c['show_state'] = True
        cards.append(c)
    cards.append({'type': 'custom:bubble-card', 'card_type': 'button', 'button_type': 'slider', 'entity': 'light.hall', 'modules': ['origami_base'], 'origami_base': o})
    cards.append({'type': 'custom:bubble-card', 'card_type': 'button', 'button_type': 'state', 'entity': 'sensor.living_room_temperature', 'show_icon': False, 'modules': ['origami_base'], 'origami_base': o})
scenario('base', cards)


# Media
mopts = [{}, {'cover': 'icon'}, {'cover': 'above'}, {'cover': 'background'}, {'cover': 'background icon'}, {'cover': 'background above'}, {'collapse': True},
         {'solid_controls': True}, {'keep_name': True}, {'state': 'A state of its own'}, {'badge': True}, {'icon_color': {'playing': 'var(--green-color)'}},
         {'players': ['media_player.kitchen_speaker_ma']}, {'cover': 'above', 'keep_name': True}, {'cover': 'background', 'cover_mix': 60, 'cover_blur': True}]
play = [{'name': 'Play row', 'group': [{'icon': 'mdi:shuffle'}, {'icon': 'mdi:skip-previous'}, {'icon': 'mdi:pause', 'css_class': 'play'}, {'icon': 'mdi:skip-next'}, {'icon': 'mdi:heart-outline'}]}]
cards = []
for o in mopts:
    for ent in ('media_player.living_room', 'media_player.kitchen_speaker'):
        for bottom in ([], play):
            cards.append({'type': 'custom:bubble-card', 'card_type': 'media-player', 'button_type': 'state', 'entity': ent, 'modules': ['origami_base', 'origami_media'], 'origami_media': o,
                          'hide': {'power_button': True, 'previous_button': True, 'next_button': True, 'volume_button': True, 'play_pause_button': True},
                          'rows': 'auto', 'sub_button': {'main': [{'icon': 'mdi:speaker', 'css_class': 'members'}], 'bottom': copy.deepcopy(bottom), 'bottom_layout': 'rows'}})
scenario('media', cards)


# Slider
rows = [{'entity': 'light.kitchen', 'sub_button_type': 'slider', 'always_visible': True, 'name': 'Kitchen'},
        {'entity': 'light.hall', 'sub_button_type': 'slider', 'always_visible': True},
        {'entity': 'input_boolean.guest', 'name': 'Guest mode', 'tap_action': {'action': 'toggle'}},
        {'entity': 'light.desk', 'sub_button_type': 'slider', 'always_visible': True, 'name': 'A desk lamp with a name too long for its column'}]
cards = []
for o in ({}, {'label_width': '30%'}, {'label_width': '90px'}):
    cards.append({'type': 'custom:bubble-card', 'card_type': 'sub-buttons', 'modules': ['origami_slider'], 'origami_slider': o, 'sub_button': {'main': [], 'bottom': copy.deepcopy(rows)}})
    cards.append({'type': 'custom:bubble-card', 'card_type': 'sub-buttons', 'modules': ['origami_slider'], 'origami_slider': o, 'sub_button': {'main': [], 'bottom': [{'group': copy.deepcopy(rows)}]}})
for name, keys2 in ((None, []), ('Group ·', []), (None, [{'icon': 'mdi:chevron-down'}]), ('Group ·', [{'icon': 'mdi:chevron-down'}, {'icon': 'mdi:cog'}])):
    c = {'type': 'custom:bubble-card', 'card_type': 'button', 'button_type': 'slider', 'entity': 'number.volume', 'modules': ['origami_slider'], 'sub_button': {'main': keys2}}
    if name: c.update({'name': name, 'show_name': True})
    cards.append(c)
scenario('slider', cards)
print('Scenarios are in ' + out + '.')
