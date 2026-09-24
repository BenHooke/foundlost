from geoalchemy2 import WKBElement
from geoalchemy2.shape import from_shape, to_shape
from geojson_pydantic import Point, Polygon
from shapely.geometry import mapping, shape


def to_wkb(geom: Point | Polygon) -> WKBElement:
    return from_shape(shape(geom.model_dump()), srid=4326)


def point_from_wkb(wkb: WKBElement) -> Point:
    return Point(**mapping(to_shape(wkb)))


def polygon_from_wkb(wkb: WKBElement) -> Polygon:
    return Polygon(**mapping(to_shape(wkb)))
