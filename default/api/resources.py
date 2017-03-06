
from tastypie.resources import ModelResource
from default.models import equiInfos


class peopleInfoResource(ModelResource):
    class Meta:
        queryset = equiInfos.objects.all()
        allowed_methods = ['get']