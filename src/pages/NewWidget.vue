<template>
  <div class="container-fluid py-5" style="background-color: #444; color: white;">
    <div class="container">
        <div class="d-flex justify-content-between align-items-end mb-4">
            <h2 class="fw-bold m-0">Resultados presidenciales a nivel nacional</h2>
            <span class="text-warning fw-bold">15%* (Conteo rápido)</span>
        </div>

        <div class="row g-2">
            <div class="col-md-3">
                <div class="card card-candidate border-success border-3 custom-rounded-left">
                    <div class="card-body d-flex align-items-center p-2">
                        <div class="position-relative">
                            <img src="https://via.placeholder.com/80" class="rounded-circle border border-success border-3" alt="Rafael">
                        </div>
                        <div class="ms-3 text-dark">
                            <div class="d-flex align-items-baseline">
                                <span class="h4 fw-bold text-info mb-0">11.7%</span>
                                <small class="text-muted ms-1" style="font-size: 0.7rem;">1,692,279 votos</small>
                            </div>
                            <p class="fw-bold mb-0 small">Rafael López Aliaga</p>
                            
                        </div>
                    </div>
                </div>
                <div class="text-center mt-2">
                    <small class="text-success fw-bold border-top border-success pt-1 d-block" style="border-style: dotted !important;">En segunda vuelta</small>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card card-candidate border-warning border-3">
                    <div class="card-body d-flex align-items-center p-2">
                        <img src="https://via.placeholder.com/80" class="rounded-circle border border-warning border-3" alt="Keiko">
                        <div class="ms-3 text-dark">
                            <div class="d-flex align-items-baseline">
                                <span class="h4 fw-bold text-orange mb-0" style="color: #ff7800;">11.2%</span>
                                <small class="text-muted ms-1" style="font-size: 0.7rem;">1,692,279 votos</small>
                            </div>
                            <p class="fw-bold mb-0 small">Keiko Fujimori Higushi</p>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-candidate border-warning border-3">
                    <div class="card-body d-flex align-items-center p-2">
                        <img src="https://via.placeholder.com/80" class="rounded-circle border border-warning border-3" alt="Keiko">
                        <div class="ms-3 text-dark">
                            <div class="d-flex align-items-baseline">
                                <span class="h4 fw-bold text-orange mb-0" style="color: #ff7800;">11.2%</span>
                                <small class="text-muted ms-1" style="font-size: 0.7rem;">1,692,279 votos</small>
                            </div>
                            <p class="fw-bold mb-0 small">Keiko Fujimori Higushi</p>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-candidate border-warning border-3 custom-rounded-right">
                    <div class="card-body d-flex align-items-center p-2">
                        <img src="https://via.placeholder.com/80" class="rounded-circle border border-warning border-3" alt="Keiko">
                        <div class="ms-3 text-dark">
                            <div class="d-flex align-items-baseline">
                                <span class="h4 fw-bold text-orange mb-0" style="color: #ff7800;">11.2%</span>
                                <small class="text-muted ms-1" style="font-size: 0.7rem;">1,692,279 votos</small>
                            </div>
                            <p class="fw-bold mb-0 small">Keiko Fujimori Higushi</p>
                            
                        </div>
                    </div>
                </div>
            </div>

            </div>

        <div class="mt-4">
            <p class="small text-light" style="font-size: 0.75rem; opacity: 0.8;">
                *El especial extrae información del sitio web de la ONPE cada 20 minutos. Esto puede generar un desfase breve con respecto a su última actualización.
            </p>
        </div>
            <p class="small text-light" style="font-size: 0.75rem; opacity: 0.8;">
                Por dicho motivo,los porcentajes de votación y cantidad de votos pueden aparecer diferentes a las cifras oficiales, temporalmente.
            </p>
    </div>
</div>
</template>

<script>

export default {
  name: 'NewWidget'
}

</script>