from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from django_filters.rest_framework import FilterSet
from django_auto_prefetching import AutoPrefetchViewSetMixin
from django.contrib.auth.models import User
from rest_framework.decorators import api_view



def genericFilterSet(viewsetModel):
    class FilterSetClass(FilterSet):
        class Meta:
            model = viewsetModel
            fields = {i.name:(['exact'] if i.max_length is None else ['exact', 'icontains']) for i in viewsetModel._meta.fields}
    return FilterSetClass

def genericSerializer(viewsetModel, extended=False):
    class Serializer(ModelSerializer):
        def __init__(self, *args, **kwargs):
            super(Serializer, self).__init__(*args, **kwargs)
            if extended:
                for i in viewsetModel._meta.fields:
                    if i.remote_field is not None:
                        self.fields[i.name] = genericSerializer(i.remote_field.model)()
        class Meta:
            model = viewsetModel
            if viewsetModel == User:
                fields = ('username', 'first_name', 'last_name')
            else:
                fields = '__all__'
    return Serializer

def genericViewSet(model, extended=False):
    class ViewSet(AutoPrefetchViewSetMixin, ModelViewSet):
        serializer_class = genericSerializer(model, extended)
        queryset = model.objects.all()
        pagination_class = None
        filterset_class = genericFilterSet(model)

    return ViewSet